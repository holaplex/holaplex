import React from 'react';

export const LoadingFeedCard = () => {
  return (
    <div
      className={`relative flex aspect-square animate-pulse flex-col justify-end overflow-hidden rounded-lg border-gray-900 bg-gray-900 p-4 shadow-2xl shadow-black`}
    >
      <div className={`h-12 w-full rounded-full bg-gray-800`} />
      <div className={`absolute top-4 right-4 h-10 w-10 rounded-full bg-gray-800`} />
    </div>
  );
};

export const LoadingFeedItem = () => {
  return (
    <div
      className={`flex h-16 w-full animate-pulse items-center justify-between rounded-lg bg-gray-900 p-4 shadow-2xl shadow-black`}
    >
      <div className={`h-10 w-10 rounded-full bg-gray-800`} />
      <div className={`h-10 w-32 rounded-full bg-gray-800`} />
    </div>
  );
};
