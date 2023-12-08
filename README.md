

# Global Message Board
Welcome to the global message board! This is a place where people can come together and exchange ideas and thoughts with people across the world. A user is first met with a login screen where they must create a profile before being able to post to the board. From there a user is free to post what they like, and anything with profanities will be censored.

# Implementation
This project is setup using a docker-compose setup where there is a react front-end connected with a SQLite, Flask backend. 


## Frontend (React) app.tsx
* State Management: Uses useState for managing user inputs, authentication status, and messages.
* Real-Time Updates: Implements EventSource for live streaming of messages.
* User Authentication: Functions handleNewUser and handleExistingUser for registration and login.
* Message Posting: Allows posting new messages, with profanity filtering.
* UI: Material-UI components for layout and design.

## Backend (Flask) app.py
* Database Models: Utilizes SQLAlchemy for User and Message models.
* Endpoints: User and message management (GET, POST, DELETE routes).
* Real-time message streaming via server-sent events (/stream).
* Database: SQLite for storing user and message data.
  
## Interaction
* Users register or log in through the frontend, which interacts with the backend for authentication.
* Messages posted via the frontend are stored and streamed by the backend, displaying updates in real-time.

## Why this Fulfills the Requirements
This application:
* Allows for a user to type for a non-empty message of at most 128 characters
* Users are able to see messages on the message board from most to least recent through ordering by descending order of entry into the database
* Users are able to post to the same board and view each other's messages thanks to the real-time streaming of the database's message table
### Additionally: 
* Data is persisted and survives a server restart, through use of a SQLite database
* There is a user authentication feature that allows for sign up, log in, and logout while showing all messages posted under the logged in user with their username attached
* Profanity filter to help reduce toxicity
