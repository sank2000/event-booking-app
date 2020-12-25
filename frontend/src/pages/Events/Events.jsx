import React, { useState, useContext, useEffect } from 'react';

import classes from './style.module.scss';

import { Modal, Loader } from '../../components';
import AuthContext from '../../context/Auth';
import toast from 'react-hot-toast';

export default function Events() {
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [events, setEvent] = useState([]);

  const { token } = useContext(AuthContext);

  const [value, setValue] = useState({
    title: '',
    price: '',
    date: '',
    description: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;

    setValue(old => ({
      ...old,
      [name]: value
    }));
  };

  const fetchEvents = () => {
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

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
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        setEvent(events);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleSubmit = e => {
    e.preventDefault();

    const { title, price, date, description } = value;

    if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
      return;
    }

    setLoad(true);

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
          mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
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
        fetchEvents();
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <section className='page'>
      {token && (
        <div className={classes.events_control}>
          <p>Share your own Events!</p>
          <button className={classes.btn} onClick={() => setOpen(true)}>
            Create Event
          </button>
        </div>
      )}
      <div>
        {events.map((val, ind) => {
          return (
            <p
              key={ind}
              style={{
                fontSize: '2rem',
                padding: '2rem',
                margin: '1rem',
                border: '3px solid #000'
              }}
            >
              {val.title}
            </p>
          );
        })}
      </div>
      <Modal
        setIsOpen={setOpen}
        isOpen={open}
        CloseIcon
        title='Create Event'
        style={{ height: 'auto' }}
        disableClose={load}
      >
        <form onSubmit={handleSubmit}>
          <div className={classes.form_control}>
            <label htmlFor='title'>Title</label>
            <input type='text' id='title' required name='title' onChange={handleChange} value={value.title} />
          </div>
          <div className={classes.form_control}>
            <label htmlFor='price'>Price</label>
            <input type='number' id='price' required name='price' onChange={handleChange} value={value.price} />
          </div>
          <div className={classes.form_control}>
            <label htmlFor='date'>Date</label>
            <input type='datetime-local' id='date' required name='date' onChange={handleChange} value={value.date} />
          </div>
          <div className={classes.form_control}>
            <label htmlFor='description'>Description</label>
            <textarea
              id='description'
              rows='4'
              required
              name='description'
              onChange={handleChange}
              value={value.description}
            />
          </div>
          <div className={classes.form_action}>
            <button type='button' onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type='submit'>Submit {load && <Loader />}</button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
