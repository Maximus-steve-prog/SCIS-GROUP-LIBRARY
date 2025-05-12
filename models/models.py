import datetime
from db.db import db


class Emplyee(db.Model):
    __tablename__ = 'employees'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fullName = db.Column(db.String(150), nullable=False)
    Employee_Type = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    self_Description = db.Column(db.String(255), nullable=False)
    photo_path = db.Column(db.String(255), nullable=False)
    created_At = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(10), default='offline')
    validated=db.Column(db.Boolean, default=False)
    last_LoginAt = db.Column(db.DateTime)  
    
    
    def to_dict(self):
        return {
            'id': self.id,
            'fullName': self.fullName,
            'Employee_Type': self.Employee_Type,
            'self_Description': self.self_Description,
            'photo_path': self.photo_path,
            'status': self.status,
            'validated': self.validated,
            'last_LoginAt': self.last_LoginAt.isoformat() if self.last_LoginAt else None,
            'created_At': self.created_At.isoformat()
        }