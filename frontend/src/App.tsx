import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import {TextField,Button,Container,Grid} from '@mui/material';

import './App.css';
import {MessageDto} from './MessageDto';
import Message from './Message'

interface IMessage {
  content: string;
  timestamp: string; 
}

function App() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<MessageDto>>(new Array<MessageDto>());

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8001/stream');

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const newMessages = data.map((msg: IMessage) => new MessageDto(msg.content, msg.timestamp));
        setMessages(newMessages);
    };

    return () => {
        eventSource.close();
    };
  }, []);


  const formatTime = (currentdate: Date) => {
    return currentdate.getHours() + ":"  
    + currentdate.getMinutes() + ":" 
    + currentdate.getSeconds();
  }

  const handleSendMessage = async () => {
    if(input !== "") {
      const url = `https://api.api-ninjas.com/v1/profanityfilter?text=${encodeURIComponent(input)}`;
      const apiKey = process.env.REACT_APP_X_API_KEY || 'default-api-key'; // Use REACT_APP_ prefix
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
        const messageContent = { content: body.censored, timestamp: formatTime(new Date())};
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

  return (
    <div className="App">
      <div className = "input">
      <TextField
              className = "inputField"
              size= "small"
              margin="dense"
              id="messageInput"
              label="Type here..."
              name="message"
              inputProps={{maxLength: 128}}
              autoFocus
              value= {input}
              onChange={(e) => setInput(e.target.value)}      
        />
        
       <Button 
       className = "button" 
       variant="contained"
       onClick= {handleSendMessage}>
        Post it!
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
  );
}

export default App;
