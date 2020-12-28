import React, { useState, useContext, useEffect } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import classes from './style.module.scss';
import toast from 'react-hot-toast';

import AuthContext from '../../context/Auth';
import { Loader } from '../../components';

const LOGIN = gql`
  query Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userId
      token
      tokenExpiration
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($email: String!, $password: String!) {
    createUser(userInput: { email: $email, password: $password }) {
      _id
      email
    }
  }
`;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [load, setLoad] = useState(false);

  const [login, { loading, data, error }] = useLazyQuery(LOGIN);
  const [createUser] = useMutation(CREATE_USER);

  const { login: loginContext } = useContext(AuthContext);

  useEffect(() => {
    if (loading === false && data && data.login) {
      loginContext(data.login.token, data.login.userId, data.login.tokenExpiration);
    }
    //eslint-disable-next-line
  }, [loading]);

  useEffect(() => {
    if (error) {
      toast.error('Invalid email or password');
    }
    //eslint-disable-next-line
  }, [error]);

  const [value, setValue] = useState({
    email: '',
    password: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;

    setValue(old => ({
      ...old,
      [name]: value
    }));
  };

  const switchModeHandler = () => {
    setIsLogin(old => !old);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const email = value.email;
    const password = value.password;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    if (isLogin) {
      login({
        variables: {
          email: email,
          password: password
        }
      });
    } else {
      setLoad(true);
      createUser({
        variables: {
          email: email,
          password: password
        }
      })
        .then(resData => {
          setLoad(false);
          toast.success('Account Created Successfully');
          setIsLogin(true);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  return (
    <section className='fullpage' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form className={classes.auth_form} onSubmit={handleSubmit}>
        <div className={classes.form_top}>
          <img src='/ico/favicon-32x32.png' alt='logo' />
          <h3>{!isLogin ? 'Signup' : 'Login'}</h3>
        </div>
        <div className={classes.form_control}>
          <label htmlFor='email'>E-Mail</label>
          <input type='email' id='email' name='email' value={value.email} required onChange={handleChange} />
        </div>
        <div className={classes.form_control}>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            name='password'
            value={value.password}
            required
            onChange={handleChange}
          />
        </div>
        <div className={classes.form_action}>
          <button type='submit'>Submit {(load || loading) && <Loader />}</button>
          <button type='button' onClick={switchModeHandler}>
            Switch to {isLogin ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    </section>
  );
}
