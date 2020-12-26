import React, { useState, useContext } from 'react';
import classes from './style.module.scss';
import toast from 'react-hot-toast';

import AuthContext from '../../context/Auth';
import { Loader } from '../../components';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [load, setLoad] = useState(false);

  const { login } = useContext(AuthContext);

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

    setLoad(true);

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `
      };
    }

    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          toast.error('This is an error!');
          setLoad(false);
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        setLoad(false);
        if (resData.data.login && resData.data.login.token) {
          login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration);
        } else {
          toast.success('Account Created Successfully');
          setIsLogin(true);
        }
      })
      .catch(err => {
        console.log(err);
      });
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
          <button type='submit'>Submit {load && <Loader />}</button>
          <button type='button' onClick={switchModeHandler}>
            Switch to {isLogin ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    </section>
  );
}
