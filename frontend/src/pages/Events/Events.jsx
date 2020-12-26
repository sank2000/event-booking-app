import React, { useState, useContext, useEffect } from 'react';

import classes from './style.module.scss';

import { Modal, Loader, Spinner, EventList } from '../../components';
import AuthContext from '../../context/Auth';
import toast from 'react-hot-toast';

export default function Events() {
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [bookingLoad, setBookingLoad] = useState(false);
  const [pageLoad, setPageLoad] = useState(true);
  const [events, setEvent] = useState([]);
  const [openDetails, setOpenDetails] = useState(false);
  const { token, userId } = useContext(AuthContext);

  const [value, setValue] = useState({
    title: '',
    price: '',
    date: '',
    description: ''
  });

  const [selectedEvent, setSelectedEvent] = useState(null);

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
        setPageLoad(false);
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

    const requestBody = {
      query: `
          mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
              _id
              title
              description
              date
              price
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
        setEvent(old => {
          const updatedEvents = [...old];
          updatedEvents.push({
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            description: resData.data.createEvent.description,
            date: resData.data.createEvent.date,
            price: resData.data.createEvent.price,
            creator: {
              _id: userId
            }
          });
          return updatedEvents;
        });
        setLoad(false);
        setOpen(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const bookEventHandler = () => {
    if (!token) {
      setOpenDetails(false);
      return;
    }
    setBookingLoad(true);
    const requestBody = {
      query: `
          mutation {
            bookEvent(eventId: "${selectedEvent._id}") {
              _id
             createdAt
             updatedAt
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
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        toast.success('Booked Successfully !!!');
        setOpenDetails(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const setViewDetail = eventId => {
    const selected = events.find(e => e._id === eventId);
    setSelectedEvent({
      ...selected
    });
    setOpenDetails(true);
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
        {pageLoad ? (
          <Spinner style={{ height: '50rem' }} />
        ) : (
          <EventList events={events} authUserId={userId} onViewDetail={setViewDetail} />
        )}
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
      {selectedEvent !== null && (
        <Modal
          setIsOpen={setOpenDetails}
          isOpen={openDetails}
          CloseIcon
          title={'Details'}
          style={{ height: 'auto', width: 'auto' }}
          disableClose={load || bookingLoad}
        >
          <h1 style={{ fontSize: '3rem' }}>{selectedEvent.title}</h1>
          <h2 style={{ fontSize: '2rem' }}>
            ${selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p style={{ fontSize: '1.5rem' }}>{selectedEvent.description}</p>
          <div className={classes.form_action} style={{ marginTop: '2.5rem' }}>
            <button type='button' onClick={() => setOpenDetails(false)}>
              Cancel
            </button>
            {token && (
              <button type='button' onClick={() => bookEventHandler()}>
                Book {bookingLoad && <Loader />}
              </button>
            )}
          </div>
        </Modal>
      )}
    </section>
  );
}
