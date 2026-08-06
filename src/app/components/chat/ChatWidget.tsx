'use client';

import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function ChatWidget() {
  const { chatState } = useChat();

  if (!chatState.isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-2 right-2 z-50 max-w-[calc(100vw-1rem)] transition-all duration-300 sm:bottom-4 sm:right-4 ${
        chatState.isMinimized
          ? 'h-14 w-80'
          : 'h-[min(600px,calc(100dvh-1rem))] w-96 sm:max-h-[80vh]'
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
        <ChatHeader />
        {!chatState.isMinimized && (
          <>
            <ChatMessages />
            <ChatInput />
          </>
        )}
      </div>
    </div>
  );
}