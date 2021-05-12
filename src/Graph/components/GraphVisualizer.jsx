import React, { useState, useRef, useEffect } from 'react';
import styles from './GraphVisualizer.module.css';
import sourceIcon from '../../icons/triangletwo-right.svg';
import destinationIcon from '../../icons/circle.svg';
import { point, pointEq } from '../algos/common.js';
import { breathFirstSearch } from '../algos/breathFirstSearch';
import { deapthFirstSearch } from '../algos/deapthFirstSearch';
import { Debounce, twoDCopy } from '../../utils';
import TopBar from '../../TopBar/TopBar';
import Button from '../../shared/Button';
const TOTAL_WIDTH = Math.floor((window.innerWidth * 80) / 100);
const TOTAL_HEIGHT = Math.floor((window.innerHeight * 62) / 100);
const WIDTH_PER_BLOCK = 24;
const COLUMNS = Math.floor(TOTAL_WIDTH / WIDTH_PER_BLOCK);
const ROWS = Math.floor(TOTAL_HEIGHT / WIDTH_PER_BLOCK);
// console.log(ROWS);
// console.log(COLUMNS);
function genArray(ROWS, COLUMNS) {
  let arr = [];
  for (let i = 0; i < ROWS; i++) {
    arr.push(Array(COLUMNS).fill(false));
  }
  // console.log(arr);
  return arr;
}
const initialVisualizerState = (arr) => {
  return {
    active: false,
    pathTraversed: twoDCopy(arr),
    backTrack: twoDCopy(arr),
    delay: 100,
    timeOuts: [],
    runAlgo: '',
  };
};

function GraphVisualizer() {
  const [gamePaused, setGamePaused] = useState(false);
  const [visualizerState, setVisualizerState] = useState(() => {
    return initialVisualizerState(genArray(ROWS, COLUMNS));
  });
  const [source, setSource] = useState(() => point(0, 0));
  const [destination, setDestination] = useState(() =>
    point(ROWS - 1, COLUMNS - 1),
  );
  const [wall, setWall] = useState(() => genArray(ROWS, COLUMNS));
  const [mouseOn, setMouseOn] = useState();
  const [curBlock, setCurBlock] = useState();
  const [prevWall, setPrevWall] = useState();

  let reset = () => {
    for (let timer of visualizerState.timeOuts) {
      timer.clear();
    }
    setVisualizerState((vs) => ({
      ...initialVisualizerState(genArray(ROWS, COLUMNS)),
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

  useEffect(() => {
    const decideLayout = new Debounce(() => {
      const TOTAL_WIDTH = Math.floor((window.innerWidth * 80) / 100);
      const TOTAL_HEIGHT = Math.floor((window.innerHeight * 62) / 100);
      const COLUMNS = Math.floor(TOTAL_WIDTH / WIDTH_PER_BLOCK);
      const ROWS = Math.floor(TOTAL_HEIGHT / WIDTH_PER_BLOCK);
      setWall(genArray(ROWS, COLUMNS));
      setDestination(point(ROWS - 1, COLUMNS - 1));
      setVisualizerState((vs) => ({
        ...initialVisualizerState(genArray(ROWS, COLUMNS)),
        delay: vs.delay,
      }));
      console.log('called');
    }, 300);
    decideLayout.call();
    window.onresize = () => decideLayout.call();
  }, []);
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
    <div className="container">
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
          {wall.map((row, i) => (
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
      </div>
      <TopBar header="Graph Visualizer">
        <Button onClick={reset}>Reset</Button>
        <Button onClick={() => setGamePaused(!gamePaused)}>
          {gamePaused ? 'Resume' : 'Pause'}
        </Button>
        <Button>
          <label>Speed:</label>
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
        </Button>

        <Button
          onClick={() => {
            if (!visualizerState.active) {
              breathFirstSearch(
                wall.length,
                wall[0].length,
                source,
                destination,
                wall,
                visualizerState,
                setVisualizerState,
                true,
              );
            }
          }}
        >
          BreathFirstSearch
        </Button>
        <Button
          onClick={() => {
            if (!visualizerState.active) {
              deapthFirstSearch(
                wall.length,
                wall[0].length,
                source,
                destination,
                wall,
                visualizerState,
                setVisualizerState,
                true,
              );
            }
          }}
        >
          DeapthFirstSearch
        </Button>
      </TopBar>
    </div>
  );
}

export default GraphVisualizer;
