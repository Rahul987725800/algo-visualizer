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
  setEdges,
) {
  return nodes.map((node, i) => {
    return (
      <div key={node.num}>
        <div
          className={styles.nodeDistance}
          style={{ top: node.y + 'px', left: node.x + 'px' }}
        >
          {showLength && visualizerState.dijkstraDistanceNodes[node.num] && (
            <span>
              {visualizerState.dijkstraDistanceNodes[node.num] ===
              Number.MAX_VALUE ? (
                // <i className="fa fa-infinity"></i>
                <span>&infin;</span>
              ) : (
                Math.round(visualizerState.dijkstraDistanceNodes[node.num])
              )}
            </span>
          )}
        </div>
        <div
          className={styles.node}
          style={{
            top: node.y + 'px',
            left: node.x + 'px',
            background:
              nodes[i].num === startNode
                ? 'purple'
                : nodes[i].num === endNode
                ? 'red'
                : visualizerState.nodesFinalized[node.num]
                ? 'yellow'
                : visualizerState.nodesVisited[node.num]
                ? 'green'
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
          onContextMenu={(e) => {
            e.preventDefault();
            const originatingEdges = node.originatingEdges.map((e) => e.id);
            const terminatingEdges = node.terminatingEdges.map((e) => e.id);
            // remove from edges
            setEdges((edges) =>
              edges.filter(
                (e) =>
                  !originatingEdges.includes(e.id) &&
                  !terminatingEdges.includes(e.id),
              ),
            );
            // remove from other nodes
            setNodes((nodes) => {
              return nodes.map((n) => {
                const uoe = n.originatingEdges.filter(
                  (e) => !terminatingEdges.includes(e.id),
                );
                const ute = n.terminatingEdges.filter(
                  (e) => !originatingEdges.includes(e.id),
                );
                return {
                  ...n,
                  originatingEdges: uoe,
                  terminatingEdges: ute,
                };
              });
            });
            setNodes((nodes) => nodes.filter((n) => n.num !== node.num));
          }}
        >
          {node.num}
        </div>
      </div>
    );
  });
}
