import React, { useState } from 'react';
import Draggable from 'react-draggable';
import styles from './GraphAdvancedVisualizer.module.css';
function GraphAdvancedVisualizer() {
  const [nodes, setNodes] = useState([
    {
      num: 0,
      x: 0,
      y: 0,
    },
  ]);
  const [allowAddNode, setAllowAddNode] = useState(true);

  return <div className="container">fdsfsdfdsfsd</div>;
}

export default GraphAdvancedVisualizer;
