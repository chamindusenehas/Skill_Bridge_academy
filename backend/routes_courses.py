import datetime
from flask import Blueprint, request, jsonify
from database import get_db
from auth_middleware import token_required
from bson import ObjectId

courses_bp = Blueprint('courses_bp', __name__)

def serialize_course(course):
    course['_id'] = str(course['_id'])
    if 'provider_id' in course:
        course['provider_id'] = str(course['provider_id'])
    return course

# ── PUBLIC: only approved courses ──────────────────────────────────────────────
@courses_bp.route('/api/courses', methods=['GET'])
def get_courses():
    db = get_db()
    courses = list(db.courses.find({'status': 'approved'}))
    return jsonify({"courses": [serialize_course(c) for c in courses]}), 200

# ── SINGLE COURSE (any status, e.g. for preview) ───────────────────────────────
@courses_bp.route('/api/courses/<course_id>', methods=['GET'])
def get_course(course_id):
    db = get_db()
    try:
        course = db.courses.find_one({"_id": ObjectId(course_id)})
        if not course:
            return jsonify({"message": "Course not found"}), 404
        return jsonify({"course": serialize_course(course)}), 200
    except Exception:
        return jsonify({"message": "Invalid course ID"}), 400

# ── PROVIDER: their own courses (all statuses) ─────────────────────────────────
@courses_bp.route('/api/courses/my', methods=['GET'])
@token_required
def get_my_courses(current_user):
    if current_user.get('role') != 'provider':
        return jsonify({"message": "Unauthorized"}), 403
    db = get_db()
    courses = list(db.courses.find({'provider_id': current_user['user_id']}))
    return jsonify({"courses": [serialize_course(c) for c in courses]}), 200

# ── CREATE COURSE (starts as pending) ─────────────────────────────────────────
@courses_bp.route('/api/courses', methods=['POST'])
@token_required
def create_course(current_user):
    if current_user.get('role') != 'provider':
        return jsonify({"message": "Unauthorized, only providers can create courses."}), 403

    data = request.json
    if not data:
        return jsonify({"message": "No data provided"}), 400

    title = data.get('title')
    description = data.get('description')
    level = data.get('level')
    hashtags = data.get('hashtags', [])
    cover_media = data.get('cover_media')
    sections = data.get('sections', [])

    if not title or not description or not level:
        return jsonify({"message": "Title, description, and level are required"}), 400

    db = get_db()
    new_course = {
        "title": title,
        "description": description,
        "level": level,
        "hashtags": hashtags,
        "cover_media": cover_media,
        "sections": sections,
        "provider_id": current_user['user_id'],
        "provider_name": current_user.get('name', ''),
        "status": "pending",   # ← always starts pending
        "created_at": datetime.datetime.utcnow()
    }

    result = db.courses.insert_one(new_course)
    return jsonify({"message": "Course submitted for review", "course_id": str(result.inserted_id)}), 201

# ── UPDATE COURSE ──────────────────────────────────────────────────────────────
@courses_bp.route('/api/courses/<course_id>', methods=['PUT'])
@token_required
def update_course(current_user, course_id):
    role = current_user.get('role')
    if role not in ('provider', 'admin'):
        return jsonify({"message": "Unauthorized"}), 403

    data = request.json
    db = get_db()
    try:
        course = db.courses.find_one({"_id": ObjectId(course_id)})
        if not course:
            return jsonify({"message": "Course not found"}), 404

        # Providers can only edit their own courses
        if role == 'provider' and str(course.get('provider_id')) != str(current_user['user_id']):
            return jsonify({"message": "Unauthorized to edit this course"}), 403

        update_data = {}
        for field in ('title', 'description', 'level', 'hashtags', 'sections', 'cover_media'):
            if field in data:
                update_data[field] = data[field]

        if not update_data:
            return jsonify({"message": "No valid fields to update"}), 400

        # When a provider edits an approved/rejected course, reset to pending
        if role == 'provider' and course.get('status') in ('approved', 'rejected'):
            update_data['status'] = 'pending'

        db.courses.update_one({"_id": ObjectId(course_id)}, {"$set": update_data})
        return jsonify({"message": "Course updated successfully"}), 200
    except Exception:
        return jsonify({"message": "Error updating course"}), 400

# ── ADMIN: all courses with optional status filter ─────────────────────────────
@courses_bp.route('/api/admin/courses', methods=['GET'])
@token_required
def admin_get_courses(current_user):
    if current_user.get('role') != 'admin':
        return jsonify({"message": "Unauthorized"}), 403
    db = get_db()
    status = request.args.get('status')  # pending | approved | rejected | (empty = all)
    query = {}
    if status:
        query['status'] = status
    courses = list(db.courses.find(query).sort('created_at', -1))
    return jsonify({"courses": [serialize_course(c) for c in courses]}), 200

# ── ADMIN: approve a course ────────────────────────────────────────────────────
@courses_bp.route('/api/admin/courses/<course_id>/approve', methods=['PUT'])
@token_required
def approve_course(current_user, course_id):
    if current_user.get('role') != 'admin':
        return jsonify({"message": "Unauthorized"}), 403
    db = get_db()
    try:
        result = db.courses.update_one(
            {"_id": ObjectId(course_id)},
            {"$set": {"status": "approved", "reviewed_at": datetime.datetime.utcnow()}}
        )
        if result.matched_count == 0:
            return jsonify({"message": "Course not found"}), 404
        return jsonify({"message": "Course approved"}), 200
    except Exception:
        return jsonify({"message": "Invalid course ID"}), 400

# ── ADMIN: reject a course ─────────────────────────────────────────────────────
@courses_bp.route('/api/admin/courses/<course_id>/reject', methods=['PUT'])
@token_required
def reject_course(current_user, course_id):
    if current_user.get('role') != 'admin':
        return jsonify({"message": "Unauthorized"}), 403
    db = get_db()
    try:
        reason = (request.json or {}).get('reason', '')
        result = db.courses.update_one(
            {"_id": ObjectId(course_id)},
            {"$set": {"status": "rejected", "reject_reason": reason, "reviewed_at": datetime.datetime.utcnow()}}
        )
        if result.matched_count == 0:
            return jsonify({"message": "Course not found"}), 404
        return jsonify({"message": "Course rejected"}), 200
    except Exception:
        return jsonify({"message": "Invalid course ID"}), 400
