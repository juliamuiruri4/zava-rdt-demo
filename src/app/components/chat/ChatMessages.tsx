'use client';

import React, { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import ChatMessage from './ChatMessage';

export default function ChatMessages() {
  const { chatState } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, chatState.isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {chatState.messages.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <div className="mb-4">
            <svg
              className="w-12 h-12 mx-auto text-teal-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Welcome to AI Assistant!</h3>
          <p className="text-sm text-gray-600">
            Ask me anything about our products, services, or home improvement tips.
          </p>
        </div>
      )}

      {chatState.messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {chatState.isTyping && (
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div
            className="max-w-xs rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm"
            role="status"
            aria-label="Searching the catalog"
          >
            <div className="flex space-x-1" aria-hidden="true">
              <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400"></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400 [animation-delay:150ms]"></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400 [animation-delay:300ms]"></div>
            </div>
          </div>
        </div>
      )}

      {chatState.error && (
        <section
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-800"
          role="alert"
          aria-live="assertive"
          aria-labelledby="catalog-search-error"
        >
          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 4.5h.008v.008H12V16.5Z"
              />
            </svg>
            <div>
              <h3 id="catalog-search-error" className="text-sm font-semibold">
                Catalog search failed
              </h3>
              <p className="mt-1 text-sm leading-5">{chatState.error}</p>
            </div>
          </div>
        </section>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}