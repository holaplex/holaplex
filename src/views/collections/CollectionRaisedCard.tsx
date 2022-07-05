import React from 'react';

export function CollectionRaisedCard(props: { children: JSX.Element | JSX.Element[] }) {
  return <div className="rounded-2xl shadow-2xl lg:p-10">{props.children}</div>;
}
