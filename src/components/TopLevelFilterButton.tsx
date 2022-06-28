import React from 'react';

function TopLevelFilterButton({
  onClick,
  title,
  selected = false,
}: {
  title: string;
  onClick: (...args: any) => void;
  selected?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex w-28 flex-row items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full p-2 font-medium ${
        selected
          ? `bg-gray-800`
          : `cursor-pointer border border-gray-800 bg-gray-900 text-gray-300 hover:bg-gray-800`
      }`}
    >
      <p className={`mb-0 first-letter:text-base`}>{title}</p>
    </div>
  );
}

export default TopLevelFilterButton;
