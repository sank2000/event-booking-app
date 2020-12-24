import React from 'react';
import classes from './style.module.scss';

export default function Loader({ size, style }) {
  return <div className={classes.loader} style={{ width: size, height: size, ...style }}></div>;
}
