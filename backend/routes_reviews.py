import datetime
from flask import Blueprint, request, jsonify
from database import get_db
from auth_middleware import token_required

reviews_bp = Blueprint('reviews_bp', __name__)

@reviews_bp.route('/api/reviews', methods=['POST'])
@token_required
def submit_review(current_user):
    data = request.json or {}
    stars = data.get('stars')
    note = data.get('note', '').strip()
    role = data.get('role', '').strip()

    if not stars or not isinstance(stars, int) or stars < 1 or stars > 5:
        return jsonify({"message": "Stars must be an integer between 1 and 5"}), 400

    db = get_db()

    # Prevent duplicate review from same user
    existing = db.reviews.find_one({"user_id": current_user['user_id']})
    if existing:
        # Update instead
        db.reviews.update_one(
            {"user_id": current_user['user_id']},
            {"$set": {"stars": stars, "note": note, "role": role, "updated_at": datetime.datetime.utcnow()}}
        )
        return jsonify({"message": "Review updated"}), 200

    review = {
        "user_id": current_user['user_id'],
        "user_name": current_user.get('name', current_user.get('email', 'Anonymous')),
        "stars": stars,
        "note": note,
        "role": role,
        "created_at": datetime.datetime.utcnow()
    }
    db.reviews.insert_one(review)
    return jsonify({"message": "Review submitted"}), 201


@reviews_bp.route('/api/reviews', methods=['GET'])
def get_reviews():
    db = get_db()
    reviews = list(db.reviews.find())
    result = []
    for r in reviews:
        result.append({
            "_id": str(r['_id']),
            "user_name": r.get('user_name', 'Anonymous'),
            "stars": r.get('stars', 5),
            "note": r.get('note', ''),
            "role": r.get('role', ''),
        })
    return jsonify({"reviews": result}), 200


@reviews_bp.route('/api/reviews/stats', methods=['GET'])
def get_review_stats():
    db = get_db()
    reviews = list(db.reviews.find())
    total_reviews = len(reviews)
    avg_rating = round(sum(r.get('stars', 5) for r in reviews) / total_reviews, 1) if total_reviews else 0
    total_courses = db.courses.count_documents({})
    total_learners = db.users.count_documents({"role": "learner"})

    return jsonify({
        "total_reviews": total_reviews,
        "avg_rating": avg_rating,
        "total_courses": total_courses,
        "total_learners": total_learners,
    }), 200


@reviews_bp.route('/api/reviews/my', methods=['GET'])
@token_required
def get_my_review(current_user):
    db = get_db()
    review = db.reviews.find_one({"user_id": current_user['user_id']})
    if not review:
        return jsonify({"review": None}), 200
    return jsonify({"review": {
        "stars": review.get('stars', 5),
        "note": review.get('note', ''),
        "role": review.get('role', ''),
    }}), 200
