import React from 'react';
import styles from './Button.module.css';
function Button({ onClick, children, active }) {
  return (
    <button
      className={[styles.button, active ? styles.active : ''].join(' ')}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
