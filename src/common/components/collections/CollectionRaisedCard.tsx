import React from 'react';

export function CollectionRaisedCard(props: { children: JSX.Element[] }) {
  return <div className="rounded-2xl p-10 shadow-2xl">{props.children}</div>;
}
