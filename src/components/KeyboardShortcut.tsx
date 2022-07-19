import React, { FC } from 'react';

interface KeyboardShortcutProps {
  keys: string[];
}

const createKeyTitle = (keys: string[]) => {
  return keys.join(' + ');
};

const KeyboardShortcut: FC<KeyboardShortcutProps> = ({ keys }) => {
  return (
    <div className={`flex items-center justify-center rounded-lg bg-gray-800 p-1`}>
      <p className={`m-0 text-xs font-medium uppercase text-white`}>{createKeyTitle(keys)}</p>
    </div>
  );
};

export default KeyboardShortcut;
