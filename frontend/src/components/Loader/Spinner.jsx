import React from 'react';
import classes from './style.module.scss';

export default function Spinner({ style }) {
  return (
    <div className={classes.spinner} style={style}>
      <div className={classes.lds_ring}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
