import React, { useState, useContext } from 'react';
import classes from './style.module.scss';

import AuthContext from '../../context/Auth';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

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

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        if (resData.data.login.token) {
          login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration);
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
          <input type='email' id='email' name='email' value={value.email} onChange={handleChange} />
        </div>
        <div className={classes.form_control}>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' name='password' value={value.password} onChange={handleChange} />
        </div>
        <div className={classes.form_action}>
          <button type='submit'>Submit</button>
          <button type='button' onClick={switchModeHandler}>
            Switch to {isLogin ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    </section>
  );
}
