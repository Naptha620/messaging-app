import { useEffect, useRef } from 'react';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
//exports the "ChatHistory" component for App.jsx
//gets these variables from App.jsx
export default function ChatHistory ({ messages, user, selectedFriend, chatMetadata }){

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
  const handleDeleteMessage = async (messageId) => {
    const confirmDelete = window.confirm("You sure you want to delete this?");
    if (!confirmDelete) return;
    const chatId = user.uid > selectedFriend.uid ? `${user.uid}_${selectedFriend.uid}` : `${selectedFriend.uid}_${user.uid}`;
    try {
      await updateDoc(doc(db, "chats", chatId, "messages", messageId), {
        text: "",
        isDeleted: true
      });
    } catch (error) {
      console.error("Error deleting message:", error)
    }
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
          className={`flex gap-2 group animate-pop-in ${msg.uid === user.uid ? "justify-end" : "justify-start"}`}>

          {/*aligns the profile picture of a friend to the left */}
          {msg.uid !== user.uid && (
            <img
              src={msg.photoURL} 
              className="w-9 h-9 rounded-full"
              alt="Friend's Profile Picture"
              referrerPolicy="no-referrer"
            />
          )}
          {msg.uid === user.uid && !msg.isDeleted && (
            <div
              className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => handleDeleteMessage(msg.id)}
                className="text-xl hover:scale-110 transition-transform pb-4"
                title="Delete Message">
                🗑️
              </button>
            </div>
          )}  
          <div
            className={`flex flex-col ${msg.uid === user.uid ? "items-end" : "items-start"}`}>
            {msg.isDeleted ? (
              <div 
                className={`p-3 rounded-2xl max-w-md shadow-sm italic text-gray-500 bg-transparent border border-gray-300 ${
                msg.uid === user.uid ? "animate-delete=right rounded-tr-none" : "animate-delete-left rounded-tl-none"
              }`}>
                🚫 {msg.uid === user.uid ? "You deleted a message" : `${msg.displayName} deleted a message`} 🚫
              </div>
            ) : (

              <div 
                className={`p-3 rounded-2xl max-w-md shadow-sm whitespace-pre-wrap ${
                  msg.uid === user.uid
                  ? "bg-blue-500 text-white rounded-tr-none"
                  : "bg-white border border-gray-200 rounded-tl-none"
                }`}>

                {msg.text}
              </div>
            )}
            <div
              className="flex items-center gap-2 mt-1 mx-1">
              <div
                className="w-3 h-3">
                {msg.uid === user.uid && chatMetadata?.lastRead?.[selectedFriend.uid] === msg.id && (
                  <img
                    src={selectedFriend.photoURL}
                    alt="Seen"
                    className="w-3 h-3 rounded-full ring-2 ring-lime-900 ring-offset-1 ring-offset-white animate-pop-in shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              <span
                className="text-xs text-gray-400">
                  {formatTime(msg.createdAt)}
              </span>
            </div>
          </div>
          {/*makes the message blue or white coded depending on whether or not the user sent said message */}
                
          {/*aligns the profile picture of the user to the right */}
          {/*
          {msg.uid === user.uid && (
            <img 
            src={msg.photoURL} 
            className="w-9 h-9 rounded-full"
            alt="My Profile Picture"  
            referrerPolicy="no-referrer"
            />
            )}
            */}

        </div>
      ))}

      <div
        ref={messagesEndRef}
      />
    </div>
  );
}