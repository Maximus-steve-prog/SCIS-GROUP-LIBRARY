from flask import Blueprint,send_file, jsonify, request, current_app,send_from_directory
from flask_jwt_extended import jwt_required,create_access_token, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from extensions.socketio import socketio, db
from models.models import Book, BookDownloadedStory,Employee


books_bp  = Blueprint('books_bp', __name__,url_prefix='/books')

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx', 'xlsx', 'xls', 'doc'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@books_bp.route('/upload', methods=['POST'], endpoint='upload_book')
@jwt_required()
def upload_book():
    
    current_employee_id = int(get_jwt_identity())
    print(f"current_employee_id: {current_employee_id}")
    book = request.form
    title = book.get('title').strip().lower()
    description = book.get('description')
    #Check if book is already existed
    if Book.query.filter(db.func.lower(Book.title) == title).first():
        return jsonify({'message': 'Book already exists'}), 400
    # Handle book file upload
    book_file = request.files.get('book')
    # Handle book cover upload
    book_cover = request.files.get('bookCover')
    
    # get book cover name 
    book_cover_filename = book_cover.filename
    book_cover_path = os.path.join('static', 'images', book_cover_filename)
    os.makedirs(os.path.dirname(book_cover_path), exist_ok=True)
    book_cover.save(book_cover_path)
  
    book_filename = secure_filename(book_file.filename)
    book_ext = book_filename.rsplit('.', 1)[1].lower()
    book_dir = os.path.join('static', 'documents', book_ext)
    os.makedirs(book_dir, exist_ok=True)
    book_path = os.path.join(book_dir, book_filename)
    book_file.save(book_path)
    # Create Book object first
    new_book = Book(
        title=title, 
        description=description, 
        book_cover_path=book_cover_path, 
        book_path=book_path, 
        added_by=current_employee_id
    )
    
    
    # Add book to database
    db.session.add(new_book)
    db.session.commit()

    employee_name = Employee.query.get(current_employee_id).fullName
    
    socketio.emit('book_uploaded', 
                  {
                    'book': new_book.title, 
                    'employee': employee_name
                   })
    
    return jsonify({'message': 'Book uploaded successfully'}), 201

@books_bp.route('/all_books', methods=['GET'], endpoint='get_all_books')
def get_all_books():
    books = Book.query.all()
    if books is None:
        return jsonify([]), 200
    books_data = [book.to_dict() for book in books]
    return jsonify(books_data), 200
    
@books_bp.route('/update_book/<int:book_id>', methods=['PUT'], endpoint='update_book')
@jwt_required()
def update_book(book_id):
    
    current_employee_id = int(get_jwt_identity())
    book =  Book.query.get_or_404(book_id)
    if book.added_by != current_employee_id:
        return jsonify({'message': 'You are not authorized to update this book'}), 403
    title = request.form.get('title')
    description = request.form.get('description')
    
    if title:
        book.title = title
    if description:
        book.description = description
        
        
    book_cover = request.files.get('bookCover')
    if book_cover and allowed_file(book_cover.filename):
        book_cover_filename = book_cover.filename
        book_cover_path = os.path.join('static', 'images', book_cover_filename)
        os.makedirs(os.path.dirname(book_cover_path), exist_ok=True)
        book_cover.save(book_cover_path)
        book.book_cover_path = book_cover_path
        
    book_file = request.files.get('book')
    if book_file and allowed_file(book_file.filename):
        book_filename = secure_filename(book_file.filename)
        book_ext = book_filename.rsplit('.', 1)[1].lower()
        book_dir = os.path.join('static', 'documents', book_ext)
        os.makedirs(book_dir, exist_ok=True)
        book_path = os.path.join(book_dir, book_filename)
        book_file.save(book_path)
        book.book_path = book_path
        
    socketio.emit('book_updated', 
                  {
                    'book': book.title, 
                    'employee': Employee.query.get(current_employee_id).fullName
                   }
                  , broadcast=True)
    
    db.session.commit()
    return jsonify({'message': 'Book updated successfully'}), 200



@books_bp.route('/download_book/<int:book_id>', methods=['GET'], endpoint='download_book')
@jwt_required()
def download_book(book_id):
    current_employee_id = int(get_jwt_identity())
    book = Book.query.get_or_404(book_id)
    
    # Enregistrer le téléchargement
    download_record = BookDownloadedStory(
        book_id=book_id, 
        employee_id=current_employee_id, 
        downloaded_at=datetime.utcnow()
    )
    db.session.add(download_record)
    db.session.commit()
    
    # Émettre un événement websocket
    socketio.emit('book_downloaded', 
                  {
                    'book': book.title, 
                    'employee': Employee.query.get(current_employee_id).fullName
                   })
    
    
    return jsonify({'message': 'Book downloaded successfully'}), 200    