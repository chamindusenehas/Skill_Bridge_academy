import datetime
from flask import Blueprint, request, jsonify
from database import get_db
from auth_middleware import token_required
from bson import ObjectId

courses_bp = Blueprint('courses_bp', __name__)

@courses_bp.route('/api/courses', methods=['GET'])
def get_courses():
    db = get_db()
    courses = list(db.courses.find())
    
    # Convert ObjectId to string for JSON serialization
    for course in courses:
        course['_id'] = str(course['_id'])
        if 'provider_id' in course:
            course['provider_id'] = str(course['provider_id'])
            
    return jsonify({"courses": courses}), 200

@courses_bp.route('/api/courses', methods=['POST'])
@token_required
def create_course(current_user):
    # Only providers should be able to create courses (optional, but good practice)
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
        "created_at": datetime.datetime.utcnow()
    }

    result = db.courses.insert_one(new_course)
    course_id = str(result.inserted_id)

    return jsonify({"message": "Course created successfully", "course_id": course_id}), 201
