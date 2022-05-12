import React, { FC, ReactNode } from 'react';
import Button from '../elements/Button';

export const EmptyStateCTA = (props: {
  header: string;
  body?: string;
  action?: ReactNode;
  children?: ReactNode;
}) => {
  return (
    <div
      className={`flex w-full flex-col items-center gap-6 rounded-lg border border-dashed border-gray-300 p-4`}
    >
      <h6 className={`text-center text-2xl font-semibold`}>{props.header}</h6>
      {props.body && <p className={`text-center text-base text-gray-300`}>{props.body}</p>}
      {props.action}
      {props.children}
    </div>
  );
};
