import React, { useState, useContext, useEffect } from 'react';

import { Spinner, BookingList } from '../../components';
import AuthContext from '../../context/Auth';
import toast from 'react-hot-toast';

export default function Booking() {
  const [pageLoad, setPageLoad] = useState(true);
  const [bookings, setBooking] = useState([]);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchBookings();
    //eslint-disable-next-line
  }, []);

  const fetchBookings = () => {
    const requestBody = {
      query: `
          query {
            bookings {
              _id
             createdAt
             event {
               _id
               title
               date
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
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const bookings = resData.data.bookings;
        setBooking(bookings);
        setPageLoad(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const deleteBookingHandler = (bookingId, setLoad) => {
    setLoad(true);
    const requestBody = {
      query: `
          mutation {
            cancelBooking(bookingId: "${bookingId}") {
            _id
             title
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
        setBooking(prevState => {
          const updatedBookings = prevState.filter(booking => booking._id !== bookingId);
          return updatedBookings;
        });
        setLoad(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <section className='page'>
      {pageLoad ? (
        <Spinner style={{ height: '40rem' }} />
      ) : (
        <BookingList bookings={bookings} onDelete={deleteBookingHandler} />
      )}
    </section>
  );
}
