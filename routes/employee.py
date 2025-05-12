from flask import Blueprint, jsonify, request, send_from_directory, render_template
from flask_jwt_extended import jwt_required,create_access_token, get_jwt_identity #type: ignore
from werkzeug.utils import secure_filename
import os
from datetime import datetime

from db.db import db
from models.models import Employee

employee_routes = Blueprint('employee_routes', __name__, url_prefix='/employees')

UPLOAD_FOLDER = os.path.join('static', 'images')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
           
@employee_routes.route('/list', methods=['GET'])
@jwt_required()
def get_employees():
    employees = Employee.query.all()
    if employees is None:
        return jsonify([])
    return jsonify([employee.to_dict() for employee in employees])
           
           
@employee_routes.route('/', methods=['POST', 'GET'])
def register():
    if request.method == 'GET':
        return render_template('index.html')
    data = request.form
    
    fullName=data.get('fullName'), 
    employee_Type=data.get('typeEmployee'),
    password_hash=employee.set_password(data.get('registerPassword')), 
    self_Description=data.get('about'), 
    photo_path=None,
    validated=data.get('validated', 'false').lower() == 'true'

    
    photo = request.files['profilePhoto']
    if photo and allowed_file(photo.filename):
        filename = secure_filename(photo.filename)
        photo.save(os.path.join(UPLOAD_FOLDER, filename))
        photo_path = f'/images/{filename}'
        
    employee = Employee(
        fullName=fullName, 
        employee_Type=employee_Type, 
        password_hash=password_hash, 
        self_Description=self_Description, 
        photo_path=photo_path, 
        validated=validated
    )
    db.session.add(employee)
    db.session.commit()
    return jsonify(employee.to_dict())