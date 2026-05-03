import os
import datetime
import bcrypt
import jwt
from flask import Blueprint, request, jsonify
from database import get_db

auth_bp = Blueprint('auth_bp', __name__)

JWT_SECRET = os.getenv("JWT_SECRET", "default_secret_key")

@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if not data:
        return jsonify({"message": "No data provided"}), 400

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'learner') # Default role: learner

    if not name or not email or not password:
        return jsonify({"message": "Name, email, and password are required"}), 400

    db = get_db()
    users = db.users

    # Check if user already exists
    if users.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 409

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    new_user = {
        "name": name,
        "email": email,
        "password": hashed_password.decode('utf-8'),
        "role": role,
        "created_at": datetime.datetime.utcnow()
    }

    result = users.insert_one(new_user)

    return jsonify({"message": "User registered successfully", "user_id": str(result.inserted_id)}), 201

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    if not data:
        return jsonify({"message": "No data provided"}), 400

    email = data.get('email')
    password = data.get('password')

    db = get_db()
    user = db.users.find_one({"email": email})

    if not user:
        return jsonify({"message": "Invalid email or password"}), 401

    if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({"message": "Invalid email or password"}), 401

    # Generate JWT
    token_payload = {
        "user_id": str(user['_id']),
        "email": user['email'],
        "role": user['role'],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }

    token = jwt.encode(token_payload, JWT_SECRET, algorithm="HS256")

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": str(user['_id']),
            "name": user['name'],
            "email": user['email'],
            "role": user['role']
        }
    }), 200
