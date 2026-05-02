//imports some login authentication utilities
import { signInWithPopup } from "firebase/auth";
import {auth, provider } from "./firebase";

//exports the Login component for App.jsx
export default function Login () {

    //handles the login feature
    const handleLogin = async () => {

        //try/catch block for error handling
        try {

            //prompts the user to signin, waits for conformation from google signin
            const result = await signInWithPopup(auth, provider);

            //sign in conformation to the console
            console.log("Logged in as: ", result.user.displayName);
            
        } catch (error) {

            //sign in error to the console
            console.error("Login failed: ", error);
        }
    };

    return (

        //Login page background wrapper
        <div
            className="flex h-screen items-center justify-center bg-gray-100">

            {/*Login Card */}
            <div
                className="bg-white p-8 rounded-2xl shadow-md text-center max-w-sm w-full">

                {/*Welcome message */}
                <h1
                    className="text-2xl font-bold mb-6 text-gray-800">
                    Welcome
                </h1>

                {/*sign-in button */}
                <button
                    className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium w-full hover:bg-blue-600 transition"

                    //call the "handleLogin()" function and start the login process
                    onClick={handleLogin}>
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}