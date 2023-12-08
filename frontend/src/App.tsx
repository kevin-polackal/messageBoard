import React, {useState, useEffect} from 'react';
import {TextField,Button,Container,Grid} from '@mui/material';

import './App.css';
import {MessageDto} from './MessageDto';
import Message from './Message'

// To represent a message
interface IMessage {
  content: string;
  timestamp: string; 
  username: string;
}

function App() {
  //Track state of the message input
  const [input, setInput] = useState<string>("");

  //Track all the messages
  const [messages, setMessages] = useState<Array<MessageDto>>(new Array<MessageDto>());

  //Track the current username
  const [username, setUsername] = useState<string>("");

  //Track the current password
  const [password, setPassword] = useState<string>("");

  //Track if user is currently logged in
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);


  //To stream real-time view of Messages in database
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8001/stream');

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data)
        const newMessages = data.map((msg: IMessage) => new MessageDto(msg.content, msg.timestamp, msg.username));
        setMessages(newMessages);
    };

    return () => {
        eventSource.close();
    };
  }, []);


  const handleLogOut = () => {
    setIsLoggedIn(false);
    setPassword("");
    setUsername("");
  }

  //Entering a new user
  const handleNewUser = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Username and password are required.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8001/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        alert("Login failed: User already exists");
      }
    } catch (error) {
      console.error('Login request failed:', error);
      alert("Login failed: User already exists");
    }
  };

  //Logging in an existing user
  const handleExistingUser = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Username and password are required.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8001/user/${username}/${password}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        // Handle login failure, e.g., wrong credentials
        alert("Login failed: Invalid Credentials");
      }
    } catch (error) {
      console.error('Login request failed:', error);
      alert("Login failed: Server error");
    }
    
  };
  

  //format time at click of post button in hours, minutes, seconds
  const formatTime = (currentdate: Date) => {
    return currentdate.getHours() + ":"  
    + currentdate.getMinutes() + ":" 
    + currentdate.getSeconds();
  }

  //Add the message to the database, check for profanity
  const handleSendMessage = async () => {
    if(input !== "") {
      const url = `https://api.api-ninjas.com/v1/profanityfilter?text=${encodeURIComponent(input)}`;
      const apiKey = process.env.REACT_APP_X_API_KEY || 'default-api-key';
      console.log('API Key:', apiKey);
      try {
        const response = await fetch(url, {
          headers: {
            'X-Api-Key': apiKey
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const body = await response.json();
        const messageContent = { content: body.censored, timestamp: formatTime(new Date()), username: username};
        // POST request to add the message
        await fetch('http://localhost:8001/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageContent),
        });
      } catch (error) {
        console.error('Request failed:', error);
      }
    }
    setInput("");
  }

 //Login screen shown before a user can access the message board
  const loginForm = (
    <Container>
      <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{minHeight: '100vh'}}>
        <Grid item>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item gap={10}>
          <Button variant="contained" onClick={handleExistingUser}>Login</Button>
          <Button variant="contained" onClick={handleNewUser}>Create New User</Button>
        </Grid>
      </Grid>
    </Container>
  );
  
// messageBoard UI
  return (
    <div className="App">
    {!isLoggedIn ? (
      loginForm
    ) : (
      <div>
        <div className="input">
          <TextField
            className="inputField"
            size="small"
            margin="dense"
            id="messageInput"
            label="Type here..."
            name="message"
            inputProps={{ maxLength: 128 }}
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            className="button"
            variant="contained"
            onClick={handleSendMessage}
          >
            Post it!
          </Button>
          <Button
            className="button"
            variant="contained"
            color = "error"
            onClick= {handleLogOut}
          >
            Log Out
          </Button>
        </div>
        <Container>
          <Grid container direction="column" spacing={2} paddingBottom={5}>
            {messages.map((message, index) => (
              <Grid item key={index}>
                <Message key={index} message={message} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    )}
  </div>
  
    
  );
}

export default App;
