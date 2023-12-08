from flask import Flask, request, jsonify, Response, stream_with_context, json
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import time


app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////usr/src/app/db/messages.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(128), nullable=False)
    timestamp = db.Column(db.String(), nullable = False)

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "timestamp": self.timestamp
        }
    
with app.app_context():
    db.create_all()
    
@app.route('/')
def index():
    return "Hello, this is the message board backend!"


@app.route('/messages', methods=['GET'])
def get_messages():
    # Select only 'content' and 'timestamp' columns
    messages = Message.query.with_entities(Message.content, Message.timestamp).order_by(Message.id.desc()).all()

    # Convert the results to a list of dictionaries
    messages_list = [{"content": message.content, "timestamp": message.timestamp} for message in messages]
    return jsonify(messages_list)


@app.route('/messages', methods=['POST'])
def post_message():
    data = request.json

    message = Message(content=data['content'], timestamp =data['timestamp'])
    db.session.add(message)
    db.session.commit()
    return jsonify(message.to_dict()), 201

@app.route('/clear-messages', methods=['DELETE'])
def clear_messages():
    # Delete all records from the Message table
    num_rows_deleted = db.session.query(Message).delete()
    db.session.commit()
    return 'Success!'

        
        


@app.route('/stream')
def stream():
    def event_stream():
        while True:
            # Query your database
            messages = Message.query.with_entities(Message.content, Message.timestamp).order_by(Message.id.desc()).all()
            data = [{"content": message.content, "timestamp": message.timestamp} for message in messages]

            # Send data to the client
            yield f"data: {json.dumps(data)}\n\n"

            # Wait before the next query
            time.sleep(1)

    return Response(stream_with_context(event_stream()), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=4000,threaded = True)