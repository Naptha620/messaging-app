//imports "useState" and "useEffect" from react
// "useState" -- an auto updating variable
// "useEffect" -- function thats called ONCE on app load/reload
import  { useState, useEffect } from 'react';

//imports app component modules
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MessageInput from './MessageInput';
import ChatHistory from './ChatHistory';
import Login from './Login';

//imports firebase utilities
import { db, auth } from './firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

//Don't know why I have this but I probably shouldn't remove it
import './App.css';


//main APP component
function App () {

  //sets a "newMessage" |state| variable and it's setter function - "setNewMessage"
  const [newMessage, setNewMessage] = useState("");

  //sets a "messages" |state| array and it's setter function - "setMessages"
  const [messages, setMessages] = useState([]);

  //sets a "user" |state| variable with a default 'null' value and it's setter function - "setMessages"
  const [user, setUser] = useState(null);

  const [users, setUsers] = useState([]);

  const [selectedFriend, setSelectedFriend] = useState(null);

  const [chatMetadata, setChatMetadata] = useState(null);

  // "useEffect" -- runs once on app load
  useEffect(() => {

    //defines a function that gets the curernt user --when-- "onAuthStateChanged" is triggered, i.e: when the current user is different from the previous user
    const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {

      if (currentUser) {
        await currentUser.reload();
        setUser(currentUser);
      } else {
        setUser(null);
      }
      //sets the "currentUser" to the "user" variable, making it accessible later on
      //setUser(currentUser);

      if (currentUser) {
        try {

          const userRef = doc(db, "users", currentUser.uid);
  
          await setDoc(userRef, {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
          }, { merge: true });

        } catch (error) {
          console.error("Error saving user profile: ", error);
        }
      }
    });

    //cleanup function, turns off the "onAuthStateChanged" listener when useEffect is closed
    return () => unsubscribe();

    //the empty array makes sure useEffect only triggers once on app load
  }, []);

  // "useEffect" -- runs once on app load
  useEffect(() => {

    //if "user" variable still has it's default 'null', |return|, effectively stoping anyone from accesing the app
    if (!user) return;

    //if "user" variable holds anything but 'null' meaning any user credentails, |continue|

    const usersQuery = query(collection(db, "users"));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const fetchedUsers = [];
      snapshot.forEach((doc) => {
        if (doc.id !== user.uid) {
          fetchedUsers.push(doc.data());
        }
      });
      setUsers(fetchedUsers);
    });

    return () => unsubscribeUsers();
  }, [user]);

  useEffect(() => {

    if (!user || !selectedFriend) return;

    const chatId = user.uid > selectedFriend.uid ? `${user.uid}_${selectedFriend.uid}` : `${selectedFriend.uid}_${user.uid}`;

    const chatRoomRef = doc(db, "chats", chatId);

    const unsubscribeRoom = onSnapshot(chatRoomRef, (snapshot) => {
      if (snapshot.exists()) {
        setChatMetadata(snapshot.data());
      }
    }); 
    
    const messagesQuery = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    
    // "onSnapshot" -- runs constantly, looking for any changes in the "messageQuery" data. Like a background service
    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      
      //creates a "fetchedMessages" empty array, a container for holding each new message when the database messages change(courtesy of onSnapshot)
      const fetchedMessages = [];
      
      //a loop that "iterates" over every "datapoint/message" that |onSnapshot| proviedes
      snapshot.forEach((doc) => {
        
        //"pushes" the current |'object of data' or 'message'|, containing the 'id'(unique message identifier) and 'data'(text) of said message, to the end of the "fetchedMessages" array
        fetchedMessages.push({ id: doc.id, ...doc.data() });
      });
      
      //sets the final "looped through" 'fetchedMessage' array into the "messages" variable
      setMessages(fetchedMessages);

      const friendMessages = fetchedMessages.filter(msg => msg.uid !== user.uid);
      if (friendMessages.length > 0) {
        const lastMessage = friendMessages[friendMessages.length - 1];

        setDoc(chatRoomRef, {
          unreadStatus: { [user.uid]: false },
          lastRead: { [user.uid]: lastMessage.id }
        }, { merge: true });
      } else {
        setDoc(chatRoomRef, {
          unreadStatus: { [user.uid]: false }
        }, { merge: true });
      }
    }, 
    (error) => {

      //catches and throws error information in the console
      console.error("Firestore Listener Error: ", error);
    });

    //cleanup function, turns off the snapshot service listener when useEffect is closed
    return () => {
      unsubscribeMessages();
      unsubscribeRoom();
    };
    //also runs useEffect when the "user" variable changes
  }, [user, selectedFriend]);

  //an async function that wait's for, something?
  const handleSendMessage = async () => {

    //checks for empty input field, terminates if true
    if (newMessage.trim() === "" || !selectedFriend) return;
    
    //temporary variable to store the data coming from the |message input field|
    const textToSend = newMessage;

    //clears the input field, QOL change
    setNewMessage("");

    const chatId = user.uid > selectedFriend.uid ? `${user.uid}_${selectedFriend.uid}` : `${selectedFriend.uid}_${user.uid}`;

    //try block to catch errors
    try {

      // "await" -- waits for conformation from firebase before moving on to the next code
      //adds a |"Doc" or "singular message"| to the "messages" collection/folder in the firestore database containing the databeats below
      await addDoc(collection(db, "chats", chatId, "messages"), {

        //actual text content
        text: textToSend,
        //the current "user/individuals" id
        uid: user.uid,
        //the current users google account display name
        displayName: user.displayName,
        //the current users email
        email: user.email,
        //the current users google account profile picture
        photoURL: user.photoURL,
        //server side timestamp for this individual message/Doc
        createdAt: serverTimestamp()
      });

      //message saved conformation to the console
      console.log("Message saved to the cloud!");

      await setDoc(doc(db, "chats", chatId), {
        lastActivity: serverTimestamp(),
        unreadStatus: {[selectedFriend.uid]: true, [user.uid]: false
        }
      }, { merge: true });

    } catch (error) {

      //catches and throws error when messages are not saved to the firestore database
      console.error("Message Saving Error: ", error);
    }
  };

  //returns the UI components to display
  return (

    //return() must return ONE parent html element which is why the empty element/react fragment is there
    <>

      {/*if "user" contains the dafault 'null' value, meaning no one is signed in, show the login page */}
      {!user ? (

        //login component
        <Login />
      ) : (

      //otherwise, show this 
      //main div container
      <div 
        id="app-container"
        className="flex h-screen bg-gray-100 font-sans text-gray-900">

        {/*sidebar component */}
        <Sidebar
          user={user}
          users={users}
          setSelectedFriend={setSelectedFriend}
          selectedFriend={selectedFriend}
        />

        {!selectedFriend ? (
          <div
            id="welcome-screen"
            className="hidden md:flex-1 md:flex md:flex-col md:items-center md:justify-center md:bg-gray-50 md:text-gray-500">
            <div
              className="text-6xl mb-4">
              💬
            </div>
            <h2
              className="text-2xl font-semibold text-gray-700">
              Welcome to Chat!
            </h2>
            <p
              className="mt-2 text-sm">
              Select a friend from the sidebar to start a conversation
            </p>
          </div>

        ) : (

        //main chat component
        <div 
          id="main-chat"
          className={`${!selectedFriend ? 'hidden md:flex' : 'flex'} flex-1 flex-col w-full`}>

          {/*topbar component */}
          <Topbar

            //handing the "user" variable to this component, props
            user={user}
            selectedFriend={selectedFriend}
            setSelectedFriend={setSelectedFriend}
          />

          {/*chat history component */}
          <ChatHistory

          //handing props
            messages={messages}
            user={user}
            selectedFriend={selectedFriend}
            chatMetadata={chatMetadata}
          />

          <MessageInput

            //handing props
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
          />
        </div>

        )}
      </div>
      )}
    </>
  );
}

//exports the main App function itself
export default App;

//fixes data fetching issues
//useEffect(() => {
//  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//    if (currentUser) {
//      await currentUser.reload();
//      setUser(currentUser);
//    } else {
//      setUser(null);
//    }
//  });
  
//  return () => unsubscribe();
//}, []);