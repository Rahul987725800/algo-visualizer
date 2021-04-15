import React from 'react';
import NQueens from './NQueens';
import styles from './BackTrackingVisualizer.module.css';
import SudokuSolver from './SudokuSolver';
function BackTrackingVisualizer() {
  return (
    <div class="container">
      <h2>BackTracking Visualizer</h2>
      <SudokuSolver />
      <NQueens />
    </div>
  );
}

export default BackTrackingVisualizer;
