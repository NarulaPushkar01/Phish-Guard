"""
PhishGuard - Auth Controller
Handles user registration, login, and profile management logic.
"""

from flask import jsonify
from flask_jwt_extended import create_access_token
import bcrypt
from datetime import timedelta
from database.connection import get_db
from database.models import create_user, serialize_doc
from utils.validators import validate_email, validate_username, validate_password
from utils.logger import logger
from bson import ObjectId

class AuthController:
    @staticmethod
    def register(data):
        """Register a new user."""
        username = data.get('username', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Validation
        if not username or not email or not password:
            return jsonify({"error": "All fields are required"}), 400
            
        if not validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400
            
        if not validate_username(username):
            return jsonify({"error": "Username must be 3-30 alphanumeric characters"}), 400
            
        is_valid_pw, pw_msg = validate_password(password)
        if not is_valid_pw:
            return jsonify({"error": pw_msg}), 400
            
        db = get_db()
        
        # Check if user exists
        if db.users.find_one({"$or": [{"email": email}, {"username": username}]}):
            return jsonify({"error": "Username or email already exists"}), 409
            
        try:
            # Hash password
            salt = bcrypt.gensalt()
            password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
            
            # Create user
            new_user = create_user(username, email, password_hash)
            result = db.users.insert_one(new_user)
            
            # Generate token
            user_id = str(result.inserted_id)
            access_token = create_access_token(identity=user_id)
            
            # Prepare response
            user_response = serialize_doc(new_user)
            del user_response['password_hash']
            user_response['_id'] = user_id
            
            logger.info(f"New user registered: {username}")
            return jsonify({
                "message": "Registration successful",
                "token": access_token,
                "user": user_response
            }), 201
            
        except Exception as e:
            logger.error(f"Registration error: {e}")
            return jsonify({"error": "Registration failed due to server error"}), 500

    @staticmethod
    def login(data):
        """Authenticate user and return JWT."""
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
            
        db = get_db()
        
        try:
            # Find user
            user = db.users.find_one({"email": email})
            if not user:
                return jsonify({"error": "Invalid email or password"}), 401
                
            # Verify password
            if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                return jsonify({"error": "Invalid email or password"}), 401
                
            # Generate token
            user_id = str(user['_id'])
            access_token = create_access_token(identity=user_id)
            
            # Prepare response
            user_response = serialize_doc(user)
            del user_response['password_hash']
            
            logger.info(f"User logged in: {user['username']}")
            return jsonify({
                "message": "Login successful",
                "token": access_token,
                "user": user_response
            }), 200
            
        except Exception as e:
            logger.error(f"Login error: {e}")
            return jsonify({"error": "Login failed due to server error"}), 500

    @staticmethod
    def get_profile(user_id):
        """Get user profile details."""
        db = get_db()
        try:
            user = db.users.find_one({"_id": ObjectId(user_id)})
            if not user:
                return jsonify({"error": "User not found"}), 404
                
            user_response = serialize_doc(user)
            del user_response['password_hash']
            
            return jsonify({"user": user_response}), 200
        except Exception as e:
            logger.error(f"Profile fetch error: {e}")
            return jsonify({"error": "Failed to fetch profile"}), 500

    @staticmethod
    def update_profile(user_id, data):
        """Update user profile details."""
        db = get_db()
        try:
            # Allowed fields to update
            update_data = {}
            if 'full_name' in data:
                update_data['profile.full_name'] = data['full_name']
            if 'organization' in data:
                update_data['profile.organization'] = data['organization']
            if 'role' in data:
                update_data['profile.role'] = data['role']
                
            if not update_data:
                return jsonify({"error": "No valid fields provided for update"}), 400
                
            result = db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            
            if result.modified_count == 0:
                return jsonify({"message": "No changes made"}), 200
                
            # Fetch updated user
            user = db.users.find_one({"_id": ObjectId(user_id)})
            user_response = serialize_doc(user)
            del user_response['password_hash']
            
            return jsonify({
                "message": "Profile updated successfully",
                "user": user_response
            }), 200
            
        except Exception as e:
            logger.error(f"Profile update error: {e}")
            return jsonify({"error": "Failed to update profile"}), 500
