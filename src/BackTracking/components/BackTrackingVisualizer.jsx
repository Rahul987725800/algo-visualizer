import React, { useState } from 'react';
import NQueens from './NQueens';
import { Link, Switch, Route } from 'react-router-dom';
import SudokuSolver from './SudokuSolver';

function BackTrackingVisualizer() {
  const [active, setActive] = useState('sudoku');
  if (active === 'sudoku') return <SudokuSolver setActive={setActive} />;
  else if (active === 'nqueen') return <NQueens setActive={setActive} />;
}

export default BackTrackingVisualizer;
