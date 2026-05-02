import { useRef, useEffect } from 'react';

//exports the "MessageInput" component for App.jsx
//gets these variables from App.jsx
export default function MessageInput({ newMessage, setNewMessage, handleSendMessage }){

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflowY = "hidden";
      if (newMessage !== "") {
        const currentScrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = `${currentScrollHeight}px`;

        if (currentScrollHeight >= 256) {
          textareaRef.current.style.overflowY = "auto";
        }
      }
    }
  }, [newMessage]);

  return(

    //message area containing the input field and send button
    <div 
      id="message-sending-area"
      className="p-4 bg-white border-t border-gray-200 flex items-end gap-4">

      {/*input field/messaging area */}
      <textarea
        rows={1} 
        ref={textareaRef}
        placeholder="Type a message..."
        id = "message-input-field"
        className="flex-1 border border-gray-300 rounded-2xl px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none max-h-64 overflow-hidden"

        //sets the "value" of the input field to whatevers being typed and displaying it
        value={newMessage}

        //listens for anything that's being fed into the input filed by the user and updates the "newMessage" variable, allowing the code above to display the user's text
        onChange={(e) => setNewMessage(e.target.value)}

        //simulates a click on the send button when the "Enter" key is pressed
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />

      {/*send button */}
      <button 
        id="send-message-btn"
        className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 font-medium transition cursor-pointer"

        //calls the handleSendMessage() function when the send button is clicked, sending the message data to the firestore databse
        onClick={handleSendMessage}>

          Send
          
      </button>
    </div>
  );
}