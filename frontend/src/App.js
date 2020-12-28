import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ApolloLink } from 'apollo-link';

import './styles/globals.scss';

import { NavBar } from './components';
import { Auth, Events, Booking } from './pages';

import AuthContext from './context/Auth';
import { onError } from '@apollo/client/link/error';

const link = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      if (message === 'Unauthenticated!') {
        localStorage.removeItem('event_token');
        toast.error('unauthorized');
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      }
      return console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = createHttpLink({
  uri: '/graphql'
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('event_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const links = ApolloLink.from([link, authLink, httpLink]);

const client = new ApolloClient({
  link: links,
  cache: new InMemoryCache()
});

function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('event_token'),
    userId: null
  });

  useEffect(() => {
    if (auth.token !== localStorage.getItem('event_token')) {
      localStorage.setItem('event_token', auth.token);
    }
  }, [auth]);

  const login = (token, userId, tokenExpiration) => {
    setAuth({ token: token, userId: userId });
  };

  const logout = () => {
    setAuth({ token: null, userId: null });
  };

  return (
    <BrowserRouter>
      <>
        <ApolloProvider client={client}>
          <AuthContext.Provider
            value={{
              token: auth.token,
              userId: auth.userId,
              login: login,
              logout: logout
            }}
          >
            <NavBar />
            <Toaster
              position='bottom-center'
              reverseOrder={false}
              toastOptions={{
                style: {
                  fontSize: '2rem',
                  zIndex: 9999
                }
              }}
            />
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
        </ApolloProvider>
      </>
    </BrowserRouter>
  );
}

export default App;
