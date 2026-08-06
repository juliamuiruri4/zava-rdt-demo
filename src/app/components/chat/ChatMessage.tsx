'use client';

import React from 'react';
import { Message } from '../../types/chat';
import ProductCitationCard from './ProductCitationCard';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const hasSearchResults =
    !isUser &&
    message.searchResult !== undefined &&
    message.searchResult.products.length > 0;
  const hasEmptySearchResult =
    !isUser &&
    message.searchResult !== undefined &&
    message.searchResult.products.length === 0;
  
  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(timestamp);
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return (
          <svg className="w-3 h-3 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
          </svg>
        );
      case 'delivered':
        return (
          <svg className="w-3 h-3 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
      )}

      <div
        className={`flex min-w-0 flex-col ${
          isUser ? 'max-w-xs items-end' : 'w-full max-w-xs items-start'
        }`}
      >
        {/* Image attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className={`mb-2 ${isUser ? 'flex justify-end' : ''}`}>
            <div className="grid gap-1 max-w-xs">
              {message.attachments.map((attachment) => (
                <div key={attachment.id} className="relative">
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    style={{ maxHeight: '200px' }}
                    onClick={() => {
                      // Open image in new tab for full size view
                      window.open(attachment.url, '_blank');
                    }}
                  />
                  <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded truncate">
                    {attachment.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Text message bubble (only show if there's content) */}
        {message.content && !hasEmptySearchResult && !hasSearchResults && (
          <div
            className={`rounded-2xl px-4 py-3 shadow-sm ${
              isUser
                ? 'bg-teal-600 text-white rounded-br-sm'
                : 'bg-white text-gray-900 rounded-tl-sm border border-gray-200'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          </div>
        )}

        {hasSearchResults && message.searchResult && (
          <>
            <div className="rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm">
              <p className="break-words text-sm">
                I found {message.searchResult.total}{' '}
                {message.searchResult.total === 1 ? 'product' : 'products'} in
                the catalog for &quot;{message.searchResult.query}&quot;.
              </p>
            </div>
            <section
              className="mt-2 w-full"
              aria-label={`Catalog sources for ${message.searchResult.query}`}
            >
              <div className="mb-2 flex items-center justify-between gap-2 px-1">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-800">
                  Catalog sources
                </h3>
                <span className="text-xs text-gray-500">
                  {message.searchResult.products.length} shown
                </span>
              </div>
              <ol className="space-y-2">
                {message.searchResult.products.map((product, index) => (
                  <li key={product.id}>
                    <ProductCitationCard
                      product={product}
                      citationNumber={index + 1}
                    />
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}

        {hasEmptySearchResult && message.searchResult && (
          <section
            className="w-full rounded-xl border border-teal-100 bg-teal-50 p-4 text-teal-950"
            aria-labelledby={`empty-search-${message.id}`}
          >
            <div className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-teal-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>
              <div className="min-w-0">
                <h3
                  id={`empty-search-${message.id}`}
                  className="text-sm font-semibold text-gray-900"
                >
                  No catalog matches
                </h3>
                <p className="mt-1 break-words text-sm leading-5">
                  Nothing matched &quot;{message.searchResult.query}&quot;. Try a different
                  product name, category, or fewer search terms.
                </p>
              </div>
            </div>
          </section>
        )}
        
        <div className={`flex items-center mt-1 space-x-1 text-xs text-gray-500 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <span>{formatTime(message.timestamp)}</span>
          {isUser && getStatusIcon()}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      )}
    </div>
  );
}