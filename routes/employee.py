from flask import Blueprint, jsonify, request, current_app,send_from_directory, render_template
from flask_jwt_extended import jwt_required,create_access_token, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from extensions.socketio import socketio, db
from models.models import Employee

employee_routes = Blueprint('employee_routes', __name__, url_prefix='/employees')

UPLOAD_FOLDER = os.path.join('static', 'images')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
           
@employee_routes.route('/get_all_employees', methods=['GET'])
@jwt_required()
def get_employees():
    print("Received request for get_all_employees")
    current_employee_id = int(get_jwt_identity())
    print(f"current_employee_id: {current_employee_id}")
    employees = Employee.query.filter(Employee.id != current_employee_id).all()
    print(f"Number of employees found: {len(employees)}")
    if employees is None:
        return jsonify([]), 200
    return jsonify([employee.to_dict() for employee in employees])
           
# EndPoint to register a new employee           
@employee_routes.route('/', methods=['POST', 'GET'])
def register():
    if request.method == 'GET':
        return render_template('index.html')
    
    data = request.form
    fullName = data.get('fullName')
    employee_Type = data.get('typeEmployee')
    self_Description = data.get('about')
    validated = data.get('validated', 'false').lower() == 'true'
    
    existing_employee = Employee.query.filter_by(fullName=fullName).first()
    if existing_employee:
        return jsonify({'message': 'Employee already exists'}), 400
    
    # Handle profile photo upload
    photo = request.files.get('profilePhoto')
    photo_path = None
    if photo and allowed_file(photo.filename):
        filename = secure_filename(photo.filename)
        photo.save(os.path.join(UPLOAD_FOLDER, filename))
        photo_path = f'/images/{filename}'
    
    # Create Employee object first
    employee = Employee(
        fullName=fullName,
        employee_Type=employee_Type,
        self_Description=self_Description,
        photo_path=photo_path,
        validated=validated
    )
    
    # Set password after creating the object
    password = data.get('registerPassword')
    employee.set_password(password)
    
    # Save to database
    db.session.add(employee)
    db.session.commit()
    
    return jsonify(employee.to_dict())


# EndPoint to login an employee
@socketio.on('login')
def login(data):
    with current_app.app_context():  # <-- this is important
        try:
            if not data:
                socketio.emit('login_error', {'message': 'No data provided'})
                return

            fullName = data['fullName']
            password = data['password']

            if not fullName or not password:
                socketio.emit('login_error', {'message': 'Full name and password are required', 'login' : fullName})
                return

            employee = Employee.query.filter_by(fullName=fullName).first()
            if not employee or not employee.check_password(password):
                socketio.emit('login_error', {'message': 'Invalid credentials', 'login' : fullName})
                return

            # Update employee status and login time
            employee.status = 'online'
            employee.last_LoginAt = datetime.utcnow()
            db.session.commit()

            # Create token
            access_token = create_access_token(identity=str(employee.id))
            socketio.emit('login_success', {
                'token': access_token,
                'me': employee.fullName,
                'id': employee.id,
                'status': employee.status
            })
            socketio.emit('connected_other_user', {
                'employee': employee.fullName,
                'status': employee.status
            })

        except (KeyError, TypeError) as e:
            socketio.emit('login_error', {'message': f'Invalid request data: {str(e)}', 'login' : fullName})
        except Exception as e:
            db.session.rollback()
            socketio.emit('login_error', {'message': f'An error occurred: {str(e)}'})