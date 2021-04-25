import React, { useState } from 'react';
import styles from './GraphAdvancedVisualizer.module.css';
export default function Nodes(
  nodes,
  showLength,
  visualizerState,
  startNode,
  endNode,
  setNodes,
  setStartNode,
  setEndNode,
) {
  return nodes.map((node, i) => {
    return (
      <div key={node.num}>
        <div
          className={styles.nodeDistance}
          style={{ top: node.y + 'px', left: node.x + 'px' }}
        >
          {showLength && (
            <span>
              {visualizerState.dijkstraDistanceNodes[i] === Number.MAX_VALUE
                ? // <i className="fa fa-infinity"></i>
                  '&infin;'
                : visualizerState.dijkstraDistanceNodes[i]}
            </span>
          )}
        </div>
        <div
          className={styles.node}
          style={{
            top: node.y + 'px',
            left: node.x + 'px',
            background: visualizerState.nodesFinalized[node.num]
              ? 'yellow'
              : visualizerState.nodesVisited[node.num]
              ? 'green'
              : nodes[i].num === startNode
              ? 'purple'
              : nodes[i].num === endNode
              ? 'red'
              : 'white',
          }}
          onMouseEnter={() => {
            setNodes((nodes) => {
              const unode = { ...nodes[i] };
              unode.cursorOver = true;
              const unodes = [...nodes];
              unodes[i] = unode;
              return unodes;
            });
          }}
          onMouseLeave={() => {
            setNodes((nodes) => {
              const unode = { ...nodes[i] };
              unode.cursorOver = false;
              const unodes = [...nodes];
              unodes[i] = unode;
              return unodes;
            });
          }}
          onClick={() => {
            if (!startNode) {
              setStartNode(nodes[i].num);
            } else {
              if (nodes[i].num !== startNode) setEndNode(nodes[i].num);
            }
          }}
        >
          {node.num}
        </div>
      </div>
    );
  });
}
