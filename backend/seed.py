import bcrypt
import datetime
from flask import Flask
from database import init_db, get_db
import os

app = Flask(__name__)
# Load .env variables inside init_db or configure here if needed
init_db(app)

with app.app_context():
    db = get_db()
    users = db.users
    
    # 1. Provide Admin
    admin_email = "admin@skillbridge.com"
    if not users.find_one({"email": admin_email}):
        users.insert_one({
            "name": "System Admin",
            "email": admin_email,
            "password": bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            "role": "admin",
            "created_at": datetime.datetime.utcnow()
        })
        print(f"Created Admin: {admin_email} / admin123")
    else:
        print(f"Admin {admin_email} already exists")

    # 2. Course Provider
    provider_email = "provider@skillbridge.com"
    if not users.find_one({"email": provider_email}):
        users.insert_one({
            "name": "SkillBridge Educator",
            "email": provider_email,
            "password": bcrypt.hashpw("provider123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            "role": "provider",
            "created_at": datetime.datetime.utcnow()
        })
        print(f"Created Provider: {provider_email} / provider123")
    else:
        print(f"Provider {provider_email} already exists")

print("Seeding complete!")
