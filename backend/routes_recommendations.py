import os
import json
import tempfile
import subprocess
from flask import Blueprint, request, jsonify
from database import get_db
from bson import ObjectId

recommendations_bp = Blueprint('recommendations_bp', __name__)

def serialize_course(course):
    course['_id'] = str(course['_id'])
    if 'provider_id' in course:
        course['provider_id'] = str(course['provider_id'])
    return course

@recommendations_bp.route('/api/recommendations/hashtags', methods=['GET'])
def get_available_hashtags():
    db = get_db()
    # Get all distinct hashtags from approved courses
    courses = list(db.courses.find({'status': 'approved'}))
    hashtags = set()
    for course in courses:
        for tag in course.get('hashtags', []):
            hashtags.add(tag)
    
    return jsonify({"hashtags": sorted(list(hashtags))}), 200

@recommendations_bp.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    data = request.json
    if not data:
        return jsonify({"message": "No data provided"}), 400

    stem_level = data.get('stem_level', 'none').lower() # none, basic, advanced
    fields = data.get('fields', []) # list of hashtags
    academic_status = data.get('academic_status', 'none').lower() # high_school, undergraduate, graduate, professional
    age = data.get('age', 18)
    try:
        age = int(age)
    except:
        age = 18
    difficulty = data.get('difficulty', 'beginner').lower() # beginner, intermediate, advanced

    db = get_db()
    # Fetch all approved courses
    courses = list(db.courses.find({'status': 'approved'}))
    
    # Generate Prolog facts for courses
    course_facts = ""
    for c in courses:
        course_id = str(c['_id'])
        hashtags = c.get('hashtags', [])
        level = c.get('level', 'beginner').lower()
        
        # Format as Prolog list, escape single quotes
        hashtags_pl = "[" + ",".join([f"'{h.lower().replace(chr(39), chr(39)+chr(39))}'" for h in hashtags]) + "]"
        course_facts += f"course('{course_id}', {hashtags_pl}, '{level}').\n"

    # Format user fields for Prolog
    fields_pl = "[" + ",".join([f"'{f.lower().replace(chr(39), chr(39)+chr(39))}'" for f in fields]) + "]"

    # Path to the static knowledge base
    kb_path = os.path.join(os.path.dirname(__file__), 'prolog', 'recommendations.pl')

    # Construct the full Prolog script
    # We query: setof(CourseID, recommend_course(StemLevel, Fields, AcadStatus, Age, Diff, CourseID), Result)
    # Using findall is safer than setof if there are duplicates, and we can unique them in Python.
    prolog_script = f"""
:- consult('{kb_path}').

{course_facts}

:- initialization(main, main).
main :-
    findall(ID, recommend_course('{stem_level}', {fields_pl}, '{academic_status}', {age}, '{difficulty}', ID), Result),
    % Remove duplicates from Result list
    sort(Result, UniqueResult),
    write(UniqueResult),
    halt.
"""

    with tempfile.NamedTemporaryFile(mode='w', suffix='.pl', delete=False) as f:
        f.write(prolog_script)
        temp_path = f.name

    try:
        # Run swipl via subprocess
        # -q = quiet, -f = specify file, -t = run initialization and halt
        result = subprocess.run(
            ['swipl', '-q', '-f', temp_path],
            capture_output=True,
            text=True
        )
        
        output = result.stdout.strip()
        
        # Parse Prolog list output: [id1,id2,id3] -> ["id1", "id2", "id3"]
        if output.startswith('[') and output.endswith(']'):
            inner = output[1:-1]
            if inner.strip() == '':
                recommended_ids = []
            else:
                recommended_ids = [val.strip() for val in inner.split(',')]
        else:
            recommended_ids = []

    except Exception as e:
        print("Prolog engine error:", str(e))
        return jsonify({"message": "Error running Prolog reasoning engine. Ensure swi-prolog is installed."}), 500
    finally:
        # Clean up temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

    # Fetch full course objects for the recommended IDs
    recommended_courses = [c for c in courses if str(c['_id']) in recommended_ids]

    return jsonify({"courses": [serialize_course(c) for c in recommended_courses]}), 200
