import os
import jwt
from functools import wraps
from flask import request, jsonify
from database import get_db

JWT_SECRET = os.getenv("JWT_SECRET", "default_secret_key")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check Authorization header: Bearer <token>
        if 'Authorization' in request.headers:
            parts = request.headers['Authorization'].split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]

        if not token:
            return jsonify({"message": "Token is missing!"}), 401
        
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            current_user = data
        except Exception as e:
            return jsonify({"message": "Token is invalid!", "error": str(e)}), 401

        return f(current_user, *args, **kwargs)
    return decorated
