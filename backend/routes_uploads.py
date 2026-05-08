import os
import uuid
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from auth_middleware import token_required

uploads_bp = Blueprint('uploads_bp', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
MAX_FILE_SIZE = 500 * 1024 * 1024 # 500 MB

@uploads_bp.route('/api/upload', methods=['POST'])
@token_required
def upload_file(current_user):
    if current_user.get('role') != 'provider':
        return jsonify({"message": "Unauthorized, only providers can upload files."}), 403

    if 'file' not in request.files:
        return jsonify({"message": "No file part in the request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    # Optional: check file size by jumping to end
    file.seek(0, os.SEEK_END)
    file_length = file.tell()
    if file_length > MAX_FILE_SIZE:
        return jsonify({"message": f"File exceeds maximum size of {MAX_FILE_SIZE/(1024*1024)}MB"}), 413
    file.seek(0) # Reset position

    if file:
        filename = secure_filename(file.filename)
        # Prefix with uuid to prevent overwrite
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        
        # Ensure directory exists just in case
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
            
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        file.save(file_path)
        
        return jsonify({
            "message": "File successfully uploaded",
            "filename": unique_filename,
            "url": f"http://localhost:5000/uploads/{unique_filename}"
        }), 201

    return jsonify({"message": "File upload failed"}), 500
