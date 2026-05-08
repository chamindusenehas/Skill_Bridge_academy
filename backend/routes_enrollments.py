import datetime
from flask import Blueprint, request, jsonify
from database import get_db
from auth_middleware import token_required
from bson import ObjectId

enrollments_bp = Blueprint('enrollments_bp', __name__)

@enrollments_bp.route('/api/enrollments', methods=['POST'])
@token_required
def enroll(current_user):
    data = request.json
    course_id = data.get('course_id')

    if not course_id:
        return jsonify({"message": "Course ID is required"}), 400

    db = get_db()
    
    try:
        # Check if course exists
        course = db.courses.find_one({"_id": ObjectId(course_id)})
        if not course:
            return jsonify({"message": "Course not found"}), 404
    except Exception:
        return jsonify({"message": "Invalid course ID format"}), 400

    # Check if already enrolled
    existing = db.enrollments.find_one({
        "user_id": current_user['user_id'],
        "course_id": course_id
    })
    
    if existing:
        return jsonify({"message": "Already enrolled"}), 409

    new_enrollment = {
        "user_id": current_user['user_id'],
        "course_id": course_id,
        "enrolled_at": datetime.datetime.utcnow(),
        "progress": {}
    }

    db.enrollments.insert_one(new_enrollment)
    return jsonify({"message": "Successfully enrolled"}), 201

@enrollments_bp.route('/api/enrollments/my', methods=['GET'])
@token_required
def get_my_enrollments(current_user):
    db = get_db()
    
    # Find all enrollments for this user
    enrollments = list(db.enrollments.find({"user_id": current_user['user_id']}))
    
    course_ids = []
    for e in enrollments:
        try:
            course_ids.append(ObjectId(e['course_id']))
        except Exception:
            continue
    
    # Fetch the actual courses
    courses = list(db.courses.find({"_id": {"$in": course_ids}}))
    
    # Map progress to each course
    enrollment_map = {str(e['course_id']): e.get('progress', {}) for e in enrollments}
    
    for course in courses:
        course['_id'] = str(course['_id'])
        if 'provider_id' in course:
            course['provider_id'] = str(course['provider_id'])
        course['user_progress'] = enrollment_map.get(course['_id'], {})
            
    return jsonify({
        "enrollments": courses,
        "progress_data": enrollment_map
    }), 200

@enrollments_bp.route('/api/enrollments/<course_id>/progress', methods=['PUT'])
@token_required
def update_progress(current_user, course_id):
    data = request.json
    video_path = data.get('video_path')
    watched_time = data.get('watched_time', 0)
    duration = data.get('duration', 0)
    mark_done = data.get('mark_done', False)

    if not video_path:
        return jsonify({"message": "video_path is required"}), 400

    db = get_db()
    
    enrollment = db.enrollments.find_one({
        "user_id": current_user['user_id'],
        "course_id": course_id
    })
    
    if not enrollment:
        return jsonify({"message": "Not enrolled in this course"}), 403

    progress = enrollment.get('progress', {})
    vid_prog = progress.get(video_path, {"watched_time": 0, "duration": 0, "done": False})
    
    # Update logic: if mark_done is true, watched_time becomes full duration
    # If not done, update watched_time only if it's greater than previous (and not already done)
    if mark_done:
        vid_prog['watched_time'] = duration
        vid_prog['duration'] = duration
        vid_prog['done'] = True
    else:
        if not vid_prog.get('done'):
            vid_prog['watched_time'] = max(vid_prog.get('watched_time', 0), watched_time)
        if duration > 0:
            vid_prog['duration'] = duration
            
    progress[video_path] = vid_prog

    db.enrollments.update_one(
        {"_id": enrollment["_id"]},
        {"$set": {"progress": progress}}
    )

    return jsonify({"message": "Progress updated", "progress": progress}), 200

@enrollments_bp.route('/api/enrollments/<course_id>/progress', methods=['GET'])
@token_required
def get_progress(current_user, course_id):
    db = get_db()
    enrollment = db.enrollments.find_one({
        "user_id": current_user['user_id'],
        "course_id": course_id
    })
    
    if not enrollment:
        return jsonify({"progress": {}}), 200
        
    return jsonify({"progress": enrollment.get('progress', {})}), 200
