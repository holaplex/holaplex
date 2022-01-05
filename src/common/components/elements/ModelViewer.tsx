import React from 'react';
import '@google/model-viewer';

const ModelViewer = (props: any) => (
  // @ts-ignore
  <model-viewer {...props} style={{ width: '60vw', height: '30vw' }}></model-viewer>
);

export default ModelViewer;
