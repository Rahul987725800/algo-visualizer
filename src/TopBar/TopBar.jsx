import React from 'react';
import styles from './TopBar.module.css';
function TopBar({ header, children }) {
  return (
    <div className={styles.container}>
      <header>{header}</header>
      <div className="controls">{children}</div>
    </div>
  );
}

export default TopBar;
