import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import SidebarSkeleton from './SidebarSkeletons';
import { User2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } = useChatStore();
    const { onlineUsers = [] } = useAuthStore();
  
    useEffect(() => {
      getUsers(); // Fetch users on component mount
    }, [getUsers]);
  
    if (isUserLoading) return <SidebarSkeleton />;
  
    console.log("Users fetched from useChatStore:", users);
    console.log("Online users fetched from useAuthStore:", onlineUsers);
  
    // Normalize online user IDs to strings for comparison
    const normalizedOnlineUsers = onlineUsers.map((id) => id.toString());
    console.log("Normalized online user IDs:", normalizedOnlineUsers);
  
    return (
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="border-b border-base-300 w-full p-5">
          <div className="flex items-center gap-2">
            <User2 className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
        </div>
  
        <div className="overflow-y-auto w-full py-3">
          {users?.length > 0 ? (
            users.map((user) => {
              const isOnline = normalizedOnlineUsers.includes(user._id.toString());
              console.log(`Is user ${user.fullname} online?`, isOnline);
  
              return (
                <button
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                    selectedUser?._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''
                  }`}
                >
                  <div className="relative mx-auto lg:mx-0">
                    <img
                      src={user.profilePic || "https://img.freepik.com/premium-photo/vector-avatar-profile-icon_837074-8917.jpg"}
                      alt={user.fullName}
                      className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                    />
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-base-100" />
                    )}
                  </div>
                  <div className="hidden lg:block text-left min-w-0">
                    <div className="font-medium truncate">{user.fullname}</div>
                    <div className="text-sm text-zinc-400">
                      {isOnline ? "Online" : "Offline"}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center text-gray-500">No users available</div>
          )}
        </div>
      </aside>
    );
  };
  
export default Sidebar;
