import React from 'react';
import '@google/model-viewer';

const ModelViewer = (props: any) => (
  // @ts-ignore
  <model-viewer {...props} style={{ width: 800, height: 400 }}></model-viewer>
);

export default ModelViewer;
