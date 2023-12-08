import { fontFamily } from '@mui/system';
import React from 'react';
import { MessageDto } from "./MessageDto";

interface MessageProps {
    message: MessageDto;
}

const Message: React.FC<MessageProps> = ({ message }) => {
    const convertTo12HrFormat = (time: string) => {
        const [hoursStr, minutesStr, secondsStr] = time.split(':');
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        const seconds = parseInt(secondsStr, 10);
    
        // Determine AM or PM suffix
        const suffix = hours >= 12 ? 'PM' : 'AM';
    
        // Convert hours from 24-hour to 12-hour format
        const formattedHours = hours % 12 || 12;
    
        // Format minutes and seconds to ensure two digits
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds.toString();
    
        // Return the formatted time
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${suffix}`;
    }
  return (
    <div 
      style={{ 
        display: "flex",
        justifyContent: "center",
        margin: "0px",
        width: '100%', // Parent container full width
        borderRadius: "20px",
      }}
    >
     <div
        style={{
          padding: "20px",
          borderRadius: "20px",
          border: "2px solid grey", // Adding grey border
          width: '85%', // Inner div takes full width of parent
          textAlign: "left",
          fontFamily: 'Arial'
          
        }}
      >
        <p style={{ margin: 0, width: '100%' }}>{message.content}</p> {/* Paragraph full width */}
        <p style={{ margin: 0, width: '100%', color:'lightgrey' }}>{convertTo12HrFormat(message.time)}</p> {/* Paragraph full width */}
    </div>
    </div>
  );
};

export default Message;
