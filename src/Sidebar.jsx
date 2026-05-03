import FriendListItem from './FriendListItem';

//exports the Sidebar component for App,jsx
export default function Sidebar({ user, users, setSelectedFriend, selectedFriend }){
    return (

        //sidebar
        <div 
            id="sidebar"
            className={`${selectedFriend ? 'hidden md:flex' : 'flex'} w-full md:w-64 bg-white border-r border-gray-200 flex-col z-20`}>

            {/*padding inside sidebar */}
            <div 
                id="sidebar-padding"
                className="p-4 border-b border-gray-200 shadow-sm">

                {/*friends header*/}
                <h2 
                    className="text-xl font-bold text-gray-800">

                    Friends
                </h2>
            </div>

            {/*friend list*/}
            <div 
                id="friend-list"
                className="p-4 flex-1 overflow-y-auto flex flex-col gap-2">

                {users.map((friend) => (
                    <FriendListItem
                        key={friend.uid}
                        friend={friend}
                        user={user}
                        selectedFriend={selectedFriend}
                        setSelectedFriend={setSelectedFriend}
                    />
                ))}
            </div>
        </div>
    );
}