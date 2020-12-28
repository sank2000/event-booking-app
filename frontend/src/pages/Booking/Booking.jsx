import React, { useState, useEffect } from 'react';

import { gql, useQuery, useMutation } from '@apollo/client';

import { Spinner, BookingList } from '../../components';
import toast from 'react-hot-toast';

const GET_BOOKINGS = gql`
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
`;

const CANCEL_BOOKING = gql`
  mutation cancelBooking($bookingId: ID!) {
    cancelBooking(bookingId: $bookingId) {
      _id
      title
    }
  }
`;

export default function Booking() {
  const [bookings, setBooking] = useState([]);

  const { loading, error, data } = useQuery(GET_BOOKINGS);
  const [cancelBooking] = useMutation(CANCEL_BOOKING);

  useEffect(() => {
    if (loading === false) {
      setBooking(data.bookings);
    }
    //eslint-disable-next-line
  }, [loading]);

  if (error) {
    toast.error(error);
  }

  const deleteBookingHandler = (bookingId, setLoad) => {
    setLoad(true);
    cancelBooking({
      variables: {
        bookingId
      }
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
      {loading ? (
        <Spinner style={{ height: '40rem' }} />
      ) : (
        <BookingList bookings={bookings} onDelete={deleteBookingHandler} />
      )}
    </section>
  );
}
