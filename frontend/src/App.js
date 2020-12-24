import React, { useState } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import './styles/globals.scss';

import { NavBar } from './components';
import { Auth, Events, Booking } from './pages';

import AuthContext from './context/Auth';

function App() {
  const [auth, setAuth] = useState({
    token: null,
    userId: null
  });

  const login = (token, userId, tokenExpiration) => {
    setAuth({ token: token, userId: userId });
  };

  const logout = () => {
    setAuth({ token: null, userId: null });
  };

  return (
    <BrowserRouter>
      <>
        <AuthContext.Provider
          value={{
            token: auth.token,
            userId: auth.userId,
            login: login,
            logout: logout
          }}
        >
          <NavBar />
          <main className='main-content'>
            <Switch>
              {auth.token && <Redirect from='/' to='/events' exact />}
              {auth.token && <Redirect from='/auth' to='/events' exact />}
              {!auth.token && <Route path='/auth' component={Auth} />}
              <Route path='/events' component={Events} />
              {auth.token && <Route path='/bookings' component={Booking} />}
              {!auth.token && <Redirect to='/auth' exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </>
    </BrowserRouter>
  );
}

export default App;
