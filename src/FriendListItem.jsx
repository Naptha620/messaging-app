import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function FriendListItem ({ friend, user, selectedFriend, setSelectedFriend }) {
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        const chatId = user.uid >friend.uid ? `${user.uid}_${friend.uid}` : `${friend.uid}_${user.uid}`;

        const chatRef = doc(db, "chats", chatId);
        
        const unsubscribe = onSnapshot(chatRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const isUnread = data.unreadStatus?.[user.uid] === true;

                if(isUnread) {
                    if (selectedFriend?.uid === friend.uid) {
                        setDoc(chatRef, {
                            unreadStatus: { [user.uid]: false }
                        }, { merge: true });
                        setHasUnread(false);
                    } else {
                        if (!hasUnread) {
                            const pingSound = new Audio('https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg');
                            pingSound.volume = 0.5;
                            pingSound.play().catch(e => console.log("Browser blocked audio", e));
                            setHasUnread(true);
                        }
                    } 
                } else {
                    setHasUnread(false);
                }
            }
        });

        return () => unsubscribe();
    }, [user.uid, friend.uid, selectedFriend, hasUnread]);

    const isSelected = friend.uid === selectedFriend?.uid;

    return (
        <div
            onClick={() => setSelectedFriend(friend)}
            className={`p-3 rounded-lg transition flex items-center justify-between gap-3 ${
                isSelected ? "bg-blue-100 border-r-4 border-blue-500" : "bg-gray-50 hover:bg-gray-100 cursor-pointer"
            }`}>
            <div
                className="flex items-center gap-3">
                <img
                    src={friend.photoURL}
                    alt={friend.displayName}
                    className="w-10 h-10 rounded-full"
                    referrerPolicy="no-referrer"
                />
                <span
                    className="font-medium text-gray-800">
                    {friend.displayName}
                </span>
            </div>
            {hasUnread && !isSelected && (
                <div
                    className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-sm">
                </div>
            )}
        </div>
    );
}