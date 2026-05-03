//imports some logout authentication utilities
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

//exports the Topbar component for App.jsx
//gets the "user" variable from App.jsx
export default function Topbar({ user, selectedFriend, setSelectedFriend }){

    //handles the logout feature
    const handleLogout = async () => {

        //try/catch block for handling errors
        try{

            //signs the current user out, waits for conformation from google signout
            await signOut(auth);

            //log out conformation to the console
            console.log(("Log Out Successful"));

        } catch(error) {

            //log out error to the console
            console.error("Logout Error: ", error);
        }
    }

    return(

        //top bar
        <div 
            id="topbar"
            className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-6 shadow-sm z-10 relative">

            <div
                className="flex items-center gap-2 md:gap-3">
                
                {selectedFriend && (
                    <button
                        onClick={() => setSelectedFriend(null)}
                        className="md:hidden p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-600">
                        👈
                    </button>
                )}

                {selectedFriend ? (
                    <>
                       <img
                            src={selectedFriend.photoURL}
                            alt="friend"
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-gray-200"
                            referrerPolicy="no-referrer"
                        />
                        <h2
                            className="text-base md:text-lg font-bold text-gray-800 truncate">
                            {selectedFriend.displayName}
                        </h2>
                    </>
                ) : (

                    <h2 
                        id="chat-header"
                        className="text-base md:text-lg font-bold text-gray-800">       
                        Chat Room      
                    </h2>
                )}
            </div>

            {/*Welcoming the user */}
            <div 
                id="user-info-box"
                className="flex items-center gap-4" >

                {/*tries to welcome the user using their google displayName, uses the users email otherwise */}
                <span 
                    className="hidden md:text-sm md:px-2 md:font-medium md:text-gray-600">
                    Hello, {user?.displayName || user?.email}!
                </span>

                {/*logout button */}
                <button 
                    id="logout-button"
                    className="bg-gray-200 px-2 md:px-4 py-2 text-sm md:text-base rounded-full hover:bg-gray-300 transition"

                    //calls the "handleLogout()" function and logs the user out
                    onClick={handleLogout}>

                    Log Out
                </button>
            </div>
        </div>
    );
}