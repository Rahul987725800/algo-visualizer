import React, { useState, useRef, useEffect } from 'react';
import styles from './GraphVisualizer.module.css';
import sourceIcon from '../../icons/triangletwo-right.svg';
import destinationIcon from '../../icons/circle.svg';
import { point, pointEq, twoDCopy } from '../algos/common.js';
import { breathFirstSearch } from '../algos/breathFirstSearch';
import { deapthFirstSearch } from '../algos/deapthFirstSearch';
const TOTAL_WIDTH = Math.floor((window.innerWidth * 80) / 100);
const TOTAL_HEIGHT = Math.floor((window.innerHeight * 62) / 100);
const WIDTH_PER_BLOCK = 24;
const COLUMNS = Math.floor(TOTAL_WIDTH / WIDTH_PER_BLOCK);
const ROWS = Math.floor(TOTAL_HEIGHT / WIDTH_PER_BLOCK);
// console.log(ROWS);
// console.log(COLUMNS);
function genArray() {
  let arr = [];
  for (let i = 0; i < ROWS; i++) {
    arr.push(Array(COLUMNS).fill(false));
  }
  return arr;
}
const initialVisualizerState = () => {
  return {
    active: false,
    pathTraversed: genArray(),
    backTrack: genArray(),
    delay: 500,
    timeOuts: [],
    runAlgo: '',
  };
};

function GraphVisualizer() {
  const [gamePaused, setGamePaused] = useState(false);
  const [visualizerState, setVisualizerState] = useState(() => {
    return initialVisualizerState();
  });
  const [source, setSource] = useState(() => point(0, 0));
  const [destination, setDestination] = useState(() =>
    point(ROWS - 1, COLUMNS - 1),
  );
  const [wall, setWall] = useState(() => genArray());
  const [mouseOn, setMouseOn] = useState();
  const [curBlock, setCurBlock] = useState();
  const [prevWall, setPrevWall] = useState();

  let reset = () => {
    for (let timer of visualizerState.timeOuts) {
      timer.clear();
    }
    setVisualizerState((vs) => ({
      ...initialVisualizerState(),
      delay: vs.delay,
    }));
  };

  const blockStyles = (i, j) => {
    if (wall[i][j]) return 'rgb(12, 53, 71)';
    if (pointEq(source, point(i, j))) return `url(${sourceIcon})`;
    if (pointEq(destination, point(i, j))) return `url(${destinationIcon})`;

    if (visualizerState.pathTraversed[i][j]) return 'rgba(0, 217, 159, 0.75)';
    if (visualizerState.backTrack[i][j]) return 'rgb(255, 254, 106)';
  };
  const args = [
    ROWS,
    COLUMNS,
    source,
    destination,
    wall,
    visualizerState,
    setVisualizerState,
  ];

  useEffect(() => {
    const srcAndDest = () => {
      if (prevWall) {
        wall[prevWall.i][prevWall.j] = true;
      }

      if (wall[curBlock.i][curBlock.j]) {
        setPrevWall({ ...curBlock });
        setWall((pw) => {
          const upw = twoDCopy(pw);
          upw[curBlock.i][curBlock.j] = false;
          return upw;
        });
      }
    };
    switch (mouseOn) {
      case 'source':
        if (pointEq(curBlock, destination)) break;
        setSource(curBlock);
        srcAndDest();
        break;
      case 'destination':
        if (pointEq(curBlock, source)) break;
        setDestination(curBlock);
        srcAndDest();
        break;
      case 'wall':
        if (pointEq(curBlock, source) || pointEq(curBlock, destination)) break;
        setWall((pw) => {
          let pwc = [];
          for (let i = 0; i < pw.length; i++) {
            let rowc = pw[i];
            pwc.push([...rowc]);
          }
          // console.log(pwc);
          pwc[curBlock.i][curBlock.j] = !pwc[curBlock.i][curBlock.j];
          return pwc;
        });
        break;
    }
  }, [curBlock, mouseOn]);
  useEffect(() => {
    if (visualizerState.active) {
      reset();
    } else {
      if (visualizerState.runAlgo === 'bfs') {
        breathFirstSearch(...args, false);
      } else if (visualizerState.runAlgo === 'dfs') {
        deapthFirstSearch(...args, false);
      }
    }
  }, [source, destination, wall]);
  const mouseLeaveOrUp = () => {
    setMouseOn('');
    // setPrevWall(null)
  };
  useEffect(() => {
    if (gamePaused) {
      for (let timer of visualizerState.timeOuts) {
        timer.pause();
      }
    } else {
      for (let timer of visualizerState.timeOuts) {
        timer.resume();
      }
    }
  }, [gamePaused]);
  return (
    <div className={styles.container}>
      <h2>Graph Visualizer</h2>
      <div>
        <div
          className={styles.grid}
          onMouseDown={(e) => {
            e.preventDefault();
            // to prevent drag
            setMouseOn(() => {
              if (pointEq(curBlock, source)) {
                return 'source';
              } else if (pointEq(curBlock, destination)) {
                return 'destination';
              } else {
                return 'wall';
              }
            });
          }}
          onMouseLeave={mouseLeaveOrUp}
          onMouseUp={mouseLeaveOrUp}
        >
          {genArray().map((row, i) => (
            <div key={i} className={styles.row}>
              {row.map((_, j) => (
                <div
                  key={j}
                  className={styles.block}
                  style={{
                    background: blockStyles(i, j),
                  }}
                  onMouseOver={() => {
                    setCurBlock(point(i, j));
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
        <div>
          <button onClick={() => setGamePaused(!gamePaused)}>
            {gamePaused ? 'Resume' : 'Pause'}
          </button>
          <label>Speed: </label>
          <input
            type="range"
            max={95}
            value={100 - visualizerState.delay / 10}
            onChange={(e) => {
              if (visualizerState.active) {
                reset();
              }
              setVisualizerState((vs) => {
                return {
                  ...vs,
                  delay: (100 - e.target.value) * 10,
                };
              });
            }}
          ></input>
          <button onClick={reset}>Reset</button>
          <button
            onClick={() => {
              if (!visualizerState.active) {
                breathFirstSearch(...args, true);
              }
            }}
          >
            BreathFirstSearch
          </button>
          <button
            onClick={() => {
              if (!visualizerState.active) {
                deapthFirstSearch(...args, true);
              }
            }}
          >
            DeapthFirstSearch
          </button>
        </div>
      </div>
    </div>
  );
}

export default GraphVisualizer;
