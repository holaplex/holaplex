import React, { FC } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const AvatarSkeleton = () => {
  return <div className={`h-6 w-6 animate-pulse rounded-full bg-gray-800`} />;
};

interface OverlappingAvatarSkeletonProps {
  numAvatars?: number;
}

export const OverlappingAvatarSkeleton: FC<OverlappingAvatarSkeletonProps> = ({
  numAvatars = 3,
}) => {
  const leftPosPixls = 12;
  const avatars = Array(numAvatars).fill(uuidv4());
  return (
    <div className={`relative`}>
      {avatars.map((avatar, idx) => (
        <div key={avatar} className={`absolute`} style={{ left: idx * leftPosPixls }}>
          <AvatarSkeleton />
        </div>
      ))}
    </div>
  );
};

interface TextSkeletonProps {
  height?: 4 | 5 | 6 | 7 | 8;
  width?: 12 | 16 | 24 | 36 | 64;
}

export const TextSkeleton: FC<TextSkeletonProps> = ({ height = 5, width = 24 }) => {
  return <div className={`h-${height} w-${width} animate-pulse rounded-md bg-gray-800`} />;
};

interface ButtonSkeletonProps {
  height?: 9 | 12;
  width?: 24 | 36;
}

export const ButtonSkeleton: FC<ButtonSkeletonProps> = ({ height = 9, width = 36 }) => {
  return <div className={`animate-pulse rounded-full bg-white w-${width} h-${height} px-4`}></div>;
};
