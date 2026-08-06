'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Message, ChatState, ChatContextType, Attachment } from '../types/chat';
import {
  searchCatalog,
  type CatalogSearchResult,
} from '../lib/chat/searchCatalog';

const initialState: ChatState = {
  messages: [],
  isOpen: false,
  isMinimized: false,
  isTyping: false,
  error: null,
};

type ChatAction =
  | { type: 'TOGGLE_CHAT' }
  | { type: 'MINIMIZE_CHAT' }
  | { type: 'MAXIMIZE_CHAT' }
  | { type: 'CLOSE_CHAT' }
  | { type: 'SEND_MESSAGE_START'; payload: { message: Message } }
  | { type: 'SEND_MESSAGE_SUCCESS'; payload: { messageId: string } }
  | { type: 'SEND_MESSAGE_ERROR'; payload: { messageId: string; error: string } }
  | { type: 'RECEIVE_MESSAGE'; payload: { message: Message } }
  | { type: 'SET_TYPING'; payload: { isTyping: boolean } }
  | { type: 'CLEAR_ERROR' };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'TOGGLE_CHAT':
      return { ...state, isOpen: !state.isOpen, isMinimized: false };
    case 'MINIMIZE_CHAT':
      return { ...state, isMinimized: true };
    case 'MAXIMIZE_CHAT':
      return { ...state, isMinimized: false };
    case 'CLOSE_CHAT':
      return { ...state, isOpen: false, isMinimized: false };
    case 'SEND_MESSAGE_START':
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
        error: null,
      };
    case 'SEND_MESSAGE_SUCCESS':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.messageId
            ? { ...msg, status: 'delivered' as const }
            : msg
        ),
      };
    case 'SEND_MESSAGE_ERROR':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.messageId
            ? { ...msg, status: 'error' as const }
            : msg
        ),
        error: action.payload.error,
        isTyping: false,
      };
    case 'RECEIVE_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
        isTyping: false,
      };
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload.isTyping };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatState, dispatch] = useReducer(chatReducer, initialState);

  const sendMessage = useCallback(async (content: string, attachments?: Attachment[]) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
      attachments,
    };

    dispatch({ type: 'SEND_MESSAGE_START', payload: { message: userMessage } });

    try {
      dispatch({ type: 'SET_TYPING', payload: { isTyping: true } });

      const searchResult = await searchCatalog(content);

      dispatch({ type: 'SEND_MESSAGE_SUCCESS', payload: { messageId: userMessage.id } });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: createGroundedResponse(searchResult),
        sender: 'ai',
        timestamp: new Date(),
        status: 'delivered',
        searchResult: {
          query: searchResult.query,
          products: searchResult.products,
          total: searchResult.total,
        },
      };

      dispatch({ type: 'RECEIVE_MESSAGE', payload: { message: aiMessage } });
    } catch (error) {
      console.error('Product search request failed:', error);
      dispatch({
        type: 'SEND_MESSAGE_ERROR',
        payload: {
          messageId: userMessage.id,
          error: 'I could not search the catalog right now. Please try again.',
        },
      });
    }
  }, []);

  const toggleChat = useCallback(() => {
    dispatch({ type: 'TOGGLE_CHAT' });
  }, []);

  const minimizeChat = useCallback(() => {
    dispatch({ type: 'MINIMIZE_CHAT' });
  }, []);

  const maximizeChat = useCallback(() => {
    dispatch({ type: 'MAXIMIZE_CHAT' });
  }, []);

  const closeChat = useCallback(() => {
    dispatch({ type: 'CLOSE_CHAT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: ChatContextType = {
    chatState,
    sendMessage,
    toggleChat,
    minimizeChat,
    maximizeChat,
    closeChat,
    clearError,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

function createGroundedResponse(searchResult: CatalogSearchResult): string {
  if (searchResult.products.length === 0) {
    return `I couldn't find any catalog products matching "${searchResult.query}". Try a different product name or category.`;
  }

  const productNames = searchResult.products
    .map((product) => product.name)
    .join(', ');

  return `I found ${searchResult.total} catalog ${searchResult.total === 1 ? 'product' : 'products'} matching "${searchResult.query}": ${productNames}.`;
}