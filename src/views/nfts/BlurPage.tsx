import React, { FC } from 'react';

const BlurPage: FC = ({ children }) => {
  return <div className={`blur-sm`}>{children}</div>;
};

export default BlurPage;
