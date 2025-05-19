# routes/message.py
import os
import jwt
from flask_socketio import emit, join_room,disconnect
from jwt.exceptions import InvalidTokenError
from datetime import datetime
from flask import Blueprint, request, jsonify, send_from_directory
from extensions.socketio import socketio, db
from models.models import Message  # import your Message model
from flask_jwt_extended import jwt_required, get_jwt_identity,decode_token
import os
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env file

SECRET_KEY = os.getenv('JWT_SECRET_KEY')
if not SECRET_KEY:
    raise Exception("SECRET_KEY not set in environment variables")
# Define a Blueprint
message_bp = Blueprint('message', __name__)

# Helper function to save media files
def save_message_file(file, msg_type):
    folder_path = os.path.join('static', 'message', msg_type)
    os.makedirs(folder_path, exist_ok=True)
    filename = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}_{file.filename}"
    file_path = os.path.join(folder_path, filename)
    file.save(file_path)
    relative_path = os.path.join('message', msg_type, filename)
    return relative_path

@message_bp.route('/send', methods=['POST'])
@jwt_required()
def send_message():
    sender_id = int(get_jwt_identity())
    receiver_id = int(request.form['receiver_id'])
    msg_type = request.form['msg_type']
    msg_content = request.form.get('msg_content', '')

    # Handle media file uploads
    if msg_type in ['video', 'audio', 'picture']:
        file = request.files.get('file')
        if not file:
            return jsonify({'error': 'File is required for media messages'}), 400
        msg_content = save_message_file(file, msg_type)

    # Create message record
    msg = Message(
        sender_id=sender_id,
        receiver_id=receiver_id,
        msg_status='received',
        msg_content=msg_content,
        msg_type=msg_type,
        send_at=datetime.utcnow()
    )
    db.session.add(msg)
    db.session.commit()

    # Emit real-time message to receiver
    room = f'user_{receiver_id}'
    socketio.emit('new_message', msg.notify(), room=room)

    return jsonify({'status': 'success', 'msg_id': msg.msg_id}), 201

@message_bp.route('/<int:user1_id>/<int:user2_id>', methods=['GET'])
def get_messages(user1_id, user2_id):
    messages = Message.query.filter(
        ((Message.sender_id == user1_id) & (Message.receiver_id == user2_id)) |
        ((Message.sender_id == user2_id) & (Message.receiver_id == user1_id))
    ).order_by(Message.send_at.asc()).all()
    return jsonify([msg.to_dict() for msg in messages])


@socketio.on('typing')
def handle_typing(data):
    sender_id = data['senderId']
    receiver_id = data['receiverId']
    is_typing = data['isTyping']
    # Send the typing status to the receiver's room
    emit('typing', {
        'senderId': int(sender_id),
        'receiverId': int(receiver_id),
        'isTyping': is_typing
    }, room=f'user_{receiver_id}')
    

@message_bp.route('/static/message/<path:filename>')
def static_message_files(filename):
    return send_from_directory(os.path.join('static', 'message'), filename)



@socketio.on('connect')
def handle_connect():
    user_id = request.args.get('user_id')
    if user_id:
        join_room(f'user_{user_id}')
        emit('join_room', {'user_id': user_id}, room=f'user_{user_id}'  )
        print(f'User {user_id} connected and joined room user_{user_id}')

@socketio.on('disconnect')
def handle_disconnect():
    print('User disconnected')