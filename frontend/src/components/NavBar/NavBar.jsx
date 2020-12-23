import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './style.module.scss';

export default function NavBar() {
  return (
    <header className={classes.nav}>
      <div className={classes.nav_logo}>
        <h1>EasyEvent</h1>
      </div>
      <nav className={classes.nav__items}>
        <ul>
          <li>
            <NavLink to='/auth'>Authenticate</NavLink>
          </li>
          <li>
            <NavLink to='/events'>Events</NavLink>
          </li>
          <li>
            <NavLink to='/bookings'>Bookings</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
