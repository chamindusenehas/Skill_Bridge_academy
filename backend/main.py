import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from database import init_db
from routes_auth import auth_bp
from routes_courses import courses_bp
from routes_uploads import uploads_bp

def create_app():
    app = Flask(__name__)
    # Allow requests from the React frontend running on localhost:5173
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize MongoDB connection
    init_db(app)

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(courses_bp)
    app.register_blueprint(uploads_bp)

    # Initialize uploads folder
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    @app.route('/uploads/<path:filename>')
    def serve_uploads(filename):
        return send_from_directory(UPLOAD_FOLDER, filename)

    @app.route('/')
    def index():
        return {"message": "Skill-Bridge Backend API is running."}

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
