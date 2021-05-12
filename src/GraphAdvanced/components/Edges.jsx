import React, { useState } from 'react';
import { calculateSlopeInDegrees } from '../helper';
import styles from './GraphAdvancedVisualizer.module.css';
export default function Edges(
  edges,
  visualizerState,
  startMakingEdge,
  setEdges,
  setNodes,
  showLength,
) {
  const [edgeHovered, setEdgeHovered] = useState(-1);
  return edges.map((edge, i) => {
    const slope = calculateSlopeInDegrees(edge);
    return (
      <div
        className={styles.edge}
        style={{
          top: edge.sy + 'px',
          left: edge.sx + 'px',
          transformOrigin: '0 0',
          transform: `rotate(${slope}deg)`,
          width: `${edge.length}px`,
          color: 'white',
          background:
            edgeHovered === i
              ? 'red'
              : visualizerState.edgesFinalized[edge.id]
              ? 'yellow'
              : visualizerState.edgesVisited[edge.id]
              ? 'green'
              : 'white',
        }}
        key={i}
        onMouseEnter={() => {
          if (startMakingEdge) return;
          setEdgeHovered(i);
        }}
        onMouseLeave={() => {
          if (startMakingEdge) return;
          setEdgeHovered(-1);
        }}
        onMouseUp={(e) => {
          if (startMakingEdge) return;
          e.edgeClicked = true;
          setEdgeHovered(-1);
          setEdges((edges) => {
            const removedEdge = { ...edges[i] };
            const updatedEdges = edges.filter(
              (edge) => edge.id !== removedEdge.id,
            );
            setNodes((nodes) => {
              const unodes = [];
              for (let node of nodes) {
                const oe = node.originatingEdges.filter(
                  (edge) => edge.id !== removedEdge.id,
                );
                const te = node.terminatingEdges.filter(
                  (edge) => edge.id !== removedEdge.id,
                );
                unodes.push({
                  ...node,
                  originatingEdges: oe,
                  terminatingEdges: te,
                });
              }
              return unodes;
            });
            return updatedEdges;
          });
        }}
      >
        {edge.directed && <span className={styles.arrow}>{'>'}</span>}
        <span
          className={styles.distance}
          style={{
            transform:
              slope < -90
                ? 'scale(-1, -1) ' + (edge.directed ? 'translateY(2.7rem)' : '')
                : slope > 90
                ? 'scale(-1, -1) ' + (edge.directed ? 'translateY(2rem)' : '')
                : 'scale(1) ' + (edge.directed ? 'translateY(-2rem)' : ''),
          }}
        >
          {showLength && Math.round(edge.length)}
          {/* <br />
          {slope} */}
        </span>
      </div>
    );
  });
}
