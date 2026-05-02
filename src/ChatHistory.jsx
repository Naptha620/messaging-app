import { useEffect, useRef } from 'react';

//exports the "ChatHistory" component for App.jsx
//gets these variables from App.jsx
export default function ChatHistory ({ messages, user}){

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth"});
    }
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp || typeof timestamp.toDate !== 'function') return "";
    return timestamp.toDate().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return(
    //chat history window
    <div 
      id="chat-history"
      className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">

      {/*loops through the messages array, draws each message and applies the appropriate conditional styling*/}
      {messages.map((msg) => (

        //container for each individual message
        <div 
          id="individual-message-container"

          //gives every message div a unique id, makes it easier for react to manage
          key={msg.id} 

          //checks if the message is sent from the current user, if so, aligns the message to the right. Otherwise, aligns it to the left
          className={`flex gap-2 animate-pop-in ${msg.uid === user.uid ? "justify-end" : "justify-start"}`}>

          {/*aligns the profile picture of a friend to the left */}
          {msg.uid !== user.uid && (
            <img
              src={msg.photoURL} 
              className="w-9 h-9 rounded-full"
              alt="Friend's Profile Picture"
              referrerPolicy="no-referrer"
            />
          )}

          <div
            className={`flex flex-col ${msg.uid === user.uid ? "items-end" : "items-start"}`}>

            <div 
              className={`p-3 rounded-2xl max-w-md shadow-sm whitespace-pre-wrap ${
              msg.uid === user.uid
                ? "bg-blue-500 text-white rounded-tr-none"
                : "bg-white border border-gray-200 rounded-tl-none"
              }`}>

              {msg.text}
            </div>
            <span
              className="text-xs text-gray-400 mt-1 mx-1">
                {formatTime(msg.createdAt)}
            </span>
          </div>
          {/*makes the message blue or white coded depending on whether or not the user sent said message */}
                
          {/*aligns the profile picture of the user to the right */}
          {msg.uid === user.uid && (
            <img 
              src={msg.photoURL} 
              className="w-9 h-9 rounded-full"
              alt="My Profile Picture"  
              referrerPolicy="no-referrer"
            />
          )}
        </div>
      ))}

      <div
        ref={messagesEndRef}
      />
    </div>
  );
}