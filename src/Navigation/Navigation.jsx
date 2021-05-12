import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../shared/Button';
import styles from './Navigation.module.css';
function Navigation() {
  return (
    <div className={styles.container}>
      <header>
        <h1>Welcome to Algo Visualizer</h1>
      </header>
      <div className={styles.links}>
        <Link to="/sorting">
          <Button>
            <h2>Sorting Algorithms</h2>
          </Button>
        </Link>
        <Link to="/searching">
          <Button>
            {' '}
            <h2>Searching Algorithms</h2>
          </Button>
        </Link>

        <Link to="/graph">
          {' '}
          <Button>
            <h2>Graph Algorithms</h2>
          </Button>
        </Link>

        <Link to="/backtracking">
          {' '}
          <Button>
            <h2>BackTracking Algorithms</h2>
          </Button>
        </Link>

        <Link to="/recursion">
          <Button>
            <h2>Recursion Algorithms</h2>
          </Button>
        </Link>

        <Link to="/advanced-graph">
          <Button>
            <h2>Advanced Graph Algorithms</h2>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Navigation;
