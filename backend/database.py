import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/skillbridge")

# Create a module-level variable for the database
db = None

def init_db(app):
    global db
    client = MongoClient(MONGO_URI)
    # The database name will be parsed from the URI or we can default to 'skillbridge'
    db_name = MONGO_URI.split('/')[-1] if '/' in MONGO_URI.split('mongodb://')[-1] else 'skillbridge'
    db = client[db_name]
    app.config["DB"] = db
    return db

def get_db():
    return db
