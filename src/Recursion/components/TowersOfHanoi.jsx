import React, { useState, useEffect } from 'react';
import styles from './TowersOfHanoi.module.css';
import { towersOfHanoi } from '../algos/towersOfHanoi';
import { Debounce } from '../../utils';
import TopBar from '../../TopBar/TopBar';
import Button from '../../shared/Button';
function getDisks(n) {
  let ans = [];
  for (let i = 0; i < n; i++) {
    ans.push({
      number: i + 1,
      hue: Math.floor(360 / n) * (i + 1),
      width: Math.floor(window.innerWidth / 7 / n) * (i + 1),
      showOn: 'A',
    });
  }
  return ans;
}
const initialVisualizerState = () => {
  return {
    active: false,
    delay: 100,
    timeOuts: [],
  };
};

function TowersOfHanoi() {
  const [nDisks, setNDisks] = useState(5);
  const [disks, setDisks] = useState(getDisks(nDisks));
  const [gamePaused, setGamePaused] = useState(false);
  const [visualizerState, setVisualizerState] = useState(() => {
    return initialVisualizerState();
  });
  const disksToShow = (rod) => {
    return disks.map((disk) =>
      disk.showOn === rod ? (
        <div
          key={disk.number}
          style={{
            width: disk.width + 'px',
            background: `hsla(${disk.hue}, 100%, 40%, .8)`,
            border: `2px solid hsla(${disk.hue}, 100%, 30%, .8)`,
          }}
          className={styles.disk}
        ></div>
      ) : null,
    );
  };
  useEffect(() => {
    const decideLayout = new Debounce(() => {
      setDisks(getDisks(nDisks));
    }, 300);
    decideLayout.call();

    window.onresize = () => decideLayout.call();
  }, []);
  let reset = () => {
    for (let timer of visualizerState.timeOuts) {
      timer.clear();
    }
    setVisualizerState((vs) => ({
      ...initialVisualizerState(),
      delay: vs.delay,
    }));
    setDisks((pd) => {
      return pd.map((d) => ({
        ...d,
        showOn: 'A',
      }));
    });
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
  useEffect(() => {
    setDisks(getDisks(nDisks));
    reset();
  }, [nDisks]);
  return (
    <div className="container">
      <div className={styles.block}>
        <div>
          <div className={styles.rod}>{disksToShow('A')}</div>
          <div className={styles.rodName}>A</div>
        </div>
        <div>
          <div className={styles.rod}>{disksToShow('B')}</div>
          <div className={styles.rodName}>B</div>
        </div>
        <div>
          <div className={styles.rod}>{disksToShow('C')}</div>
          <div className={styles.rodName}>C</div>
        </div>
      </div>
      <TopBar header="Towers of Hanoi">
        <Button onClick={() => reset()}>Reset</Button>
        <Button onClick={() => setGamePaused(!gamePaused)}>
          {gamePaused ? 'Resume' : 'Pause'}
        </Button>

        <Button>
          <label>Speed: </label>
          <input
            type="range"
            max={95}
            value={100 - visualizerState.delay / 10}
            onChange={(e) => {
              console.log('range');
              console.log(visualizerState.active);
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
        <Button>
          <lable>Number of Disks : </lable>
          <input
            type="number"
            onChange={(e) => setNDisks(+e.target.value)}
            value={nDisks}
          ></input>
        </Button>
        <Button
          onClick={() => {
            if (!visualizerState.active) {
              towersOfHanoi(
                nDisks,
                setDisks,
                visualizerState,
                setVisualizerState,
              );
            }
          }}
        >
          Start
        </Button>
      </TopBar>
    </div>
  );
}

export default TowersOfHanoi;
