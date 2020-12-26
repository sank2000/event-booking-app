import React from 'react';

import classes from './style.module.scss';

const eventItem = props => (
  <li key={props.eventId} className={classes.events__list_item}>
    <div>
      <h1>{props.title}</h1>
      <h2>
        ${props.price} - {new Date(props.date).toLocaleDateString()}
      </h2>
    </div>
    <div>
      {props.userId === props.creatorId ? (
        <p>Your the owner of this event.</p>
      ) : (
        <button className='btn' onClick={() => props.onViewDetail(props.eventId)}>
          View Details
        </button>
      )}
    </div>
  </li>
);

export default eventItem;
