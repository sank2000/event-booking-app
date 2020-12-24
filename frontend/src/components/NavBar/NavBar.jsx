import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import classes from './style.module.scss';

import AuthContext from '../../context/Auth';

export default function NavBar() {
  const { token, logout } = useContext(AuthContext);

  return (
    <header className={classes.nav}>
      <div className={classes.nav_logo}>
        <h1>EasyEvent</h1>
      </div>
      <nav className={classes.nav__items}>
        <ul>
          {!token && (
            <li>
              <NavLink to='/auth'>Login</NavLink>
            </li>
          )}
          <li>
            <NavLink to='/events'>Events</NavLink>
          </li>
          {token && (
            <>
              <li>
                <NavLink to='/bookings'>Bookings</NavLink>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
