from flask import Flask, abort, request, jsonify, Response, stream_with_context, json
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///messages.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Message Table
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(128), nullable=False)
    timestamp = db.Column(db.String(), nullable = False)
    username = db.Column(db.String(128),db.ForeignKey('user.username'), nullable= False)

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "timestamp": self.timestamp,
            "username": self.username
        }
    
# User Table    
class User(db.Model):
    username = db.Column(db.String(128), primary_key=True)
    password = db.Column(db.String(128), nullable=False)
    def to_dict(self):
        return {
            "username": self.username,
            "password": self.password
        }
with app.app_context():
    db.create_all()
   
    

# Validate if a user is present in our database 
@app.route('/user/<username>/<password>')
def get_user(username,password):
    user = User.query.filter_by(username=username,password = password).first()
    if user:
        return jsonify(user.to_dict())
    else:
        abort(404, description=f"User '{username}' not found")

# Enter a new user into our database
@app.route('/user', methods=['POST'])
def create_user():
    data = request.json
    user = User(username=data['username'], password =data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

#Get all the messages currently in our Database
@app.route('/messages', methods=['GET'])
def get_messages():

    messages = Message.query.with_entities(Message.content, Message.timestamp, Message.username).order_by(Message.id.desc()).all()
    messages_list = [{"content": message.content, "timestamp": message.timestamp, "username": message.username} for message in messages]
    return jsonify(messages_list)

#Adding a new message to the Database
@app.route('/messages', methods=['POST'])
def post_message():
    data = request.json

    message = Message(content=data['content'], timestamp =data['timestamp'], username = data['username'])
    db.session.add(message)
    db.session.commit()
    return jsonify(message.to_dict()), 201

#Clear all messages
@app.route('/clear-messages', methods=['DELETE'])
def clear_messages():
    num_rows_deleted = db.session.query(Message).delete()
    db.session.commit()
    return f'Success! {num_rows_deleted} messages deleted.'

#Clear all users
@app.route('/clear-users', methods=['DELETE'])
def clear_users():
    num_rows_deleted = db.session.query(User).delete()
    db.session.commit()
    return f'Success! {num_rows_deleted} users deleted.'

        
        


@app.route('/stream')
def stream():
    def event_stream():
        while True:
            # Query your database
            messages = Message.query.with_entities(Message.content, Message.timestamp, Message.username).order_by(Message.id.desc()).all()
            data = [{"content": message.content, "timestamp": message.timestamp, "username": message.username} for message in messages]

            # Send data to the client
            yield f"data: {json.dumps(data)}\n\n"

            # Wait before the next query
            time.sleep(1)

    return Response(stream_with_context(event_stream()), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=4000,threaded = True)