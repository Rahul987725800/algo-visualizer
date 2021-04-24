import React, { useState } from 'react';
import { calculateLength, calculateSlopeInDegrees } from '../helper';
import styles from './GraphAdvancedVisualizer.module.css';
// const sampleNode = {
//   num: 1,
//   x: 24,
//   y: 24,
//   cursorOver: false,
//   originatingEdges: [],
//   terminatingEdges: [],
// };
// const sampleEdge = {
//   sx: 0,
//   sy: 0,
//   ex: 100,
//   ey: 100,
//   startNode: 0,
//   endNode: 3,
//   directed: false
// };
function GraphAdvancedVisualizer() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [directedEdges, setDirectedEdges] = useState(false);
  const [startMakingEdge, setStartMakingEdge] = useState(false);
  const [startNode, setStartNode] = useState(0);
  const [endNode, setEndNode] = useState(0);
  const cursorOverWhichNode = () => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].cursorOver) return i;
    }
    return -1;
  };
  const addNode = (e) => {
    setNodes((nodes) => {
      return [
        ...nodes,
        {
          num: nodes.length + 1,
          x: e.pageX,
          y: e.pageY,
          originatingEdges: [],
          terminatingEdges: [],
        },
      ];
    });
  };
  return (
    <div className="container">
      <div
        className={styles.block}
        onMouseMove={(e) => {
          // console.log(e);
          if (startMakingEdge) {
            // console.log(edges);
            setEdges((edges) => {
              const uedges = [...edges];
              const uce = { ...uedges.pop() };
              uce.ex = e.pageX;
              uce.ey = e.pageY;
              uce.endNode = cursorOverWhichNode();
              uedges.push(uce);
              return uedges;
            });
          }
        }}
        onMouseDown={(e) => {
          if (cursorOverWhichNode() === -1) return;
          setStartMakingEdge(true);
          setEdges((edges) => {
            return [
              ...edges,
              {
                sx: e.pageX,
                sy: e.pageY,
                ex: e.pageX,
                ey: e.pageY,
                startNode: cursorOverWhichNode(),
                endNode: cursorOverWhichNode(),
                directed: directedEdges,
              },
            ];
          });
        }}
        onMouseUp={(e) => {
          if (startMakingEdge) {
            const currentEdge = edges[edges.length - 1];
            // console.log(currentEdge);
            if (
              currentEdge.endNode === currentEdge.startNode ||
              currentEdge.endNode === -1
            ) {
              setEdges((edges) => edges.slice(0, edges.length - 1));
            } else {
              // add edge to nodes
              if (directedEdges) {
                setNodes((nodes) => {
                  const startNode = { ...nodes[currentEdge.startNode] };
                  startNode.originatingEdges = [
                    ...startNode.originatingEdges,
                    currentEdge,
                  ];
                  const endNode = { ...nodes[currentEdge.endNode] };
                  endNode.terminatingEdges = [
                    ...endNode.terminatingEdges,
                    currentEdge,
                  ];
                  const unodes = [...nodes];
                  unodes[currentEdge.startNode] = startNode;
                  unodes[currentEdge.endNode] = endNode;
                  return unodes;
                });
              } else {
                setNodes((nodes) => {
                  const startNode = { ...nodes[currentEdge.startNode] };
                  startNode.originatingEdges = [
                    ...startNode.originatingEdges,
                    currentEdge,
                  ];
                  startNode.terminatingEdges = [
                    ...startNode.terminatingEdges,
                    currentEdge,
                  ];
                  const endNode = { ...nodes[currentEdge.endNode] };
                  endNode.originatingEdges = [
                    ...endNode.originatingEdges,
                    currentEdge,
                  ];
                  endNode.terminatingEdges = [
                    ...endNode.terminatingEdges,
                    currentEdge,
                  ];
                  const unodes = [...nodes];
                  unodes[currentEdge.startNode] = startNode;
                  unodes[currentEdge.endNode] = endNode;
                  return unodes;
                });
              }
            }
            setStartMakingEdge(false);
          } else {
            if (cursorOverWhichNode() === -1) {
              addNode(e);
            }
          }
        }}
      >
        {nodes.map((node, i) => {
          return (
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
                    : 'white',
              }}
              key={node.num}
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
          );
        })}
        {edges.map((edge, i) => {
          return (
            <div
              className={styles.edge}
              style={{
                top: edge.sy + 'px',
                left: edge.sx + 'px',
                transformOrigin: '0 0',
                transform: `rotate(${calculateSlopeInDegrees(edge)}deg)`,
                width: `${calculateLength(edge)}px`,
                color: 'white',
              }}
              key={i}
            >
              {edge.directed && <span className={styles.arrow}>{'>'}</span>}
            </div>
          );
        })}
      </div>
      <button
        onClick={() => console.log(nodes)}
        style={{ position: 'fixed', top: 0, left: 0 }}
      >
        click
      </button>
      <button
        onClick={() => setDirectedEdges(!directedEdges)}
        style={{ position: 'fixed', top: 0, left: '100px' }}
      >
        set directed
      </button>
      <button
        onClick={() => {
          setStartNode(0);
          setEndNode(0);
        }}
        style={{ position: 'fixed', top: 0, left: '200px' }}
      >
        reset nodes
      </button>
    </div>
  );
}

export default GraphAdvancedVisualizer;
