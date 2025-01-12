import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './MessageSkeleton';

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
  } = useChatStore();

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id, getMessages]);

  if (!selectedUser) {
    return <div>Please select a user to start chatting.</div>;
  }

  if (isMessagesLoading) 
    return (
      <div className='flex-l flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <p>Messages...</p>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
