import React, { useState } from 'react';

import { Loader } from '../../';

import classes from './style.module.scss';

const BookingList = props => (
  <ul className={classes.bookings__list}>
    {props.bookings.map(booking => {
      return <List key={booking._id} booking={booking} onDelete={props.onDelete} />;
    })}
  </ul>
);

const List = ({ booking, onDelete }) => {
  const [load, setLoad] = useState(false);
  return (
    <li key={booking._id} className={classes.bookings__item}>
      <div className={classes.bookings__item_data}>
        {booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}
      </div>
      <div className={classes.bookings__item_actions}>
        <button className='btn' onClick={() => onDelete(booking._id, setLoad)}>
          Cancel {load && <Loader />}
        </button>
      </div>
    </li>
  );
};

export default BookingList;
