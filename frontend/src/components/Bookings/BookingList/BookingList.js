import React from 'react';

import './BookingList.css';

const bookingList = props => (
    <ul className="bookings">
        {props.bookings.map( booking => {
            return (
                <li className="bookings__item" key={booking._id}>
                    <div className="booking__item-data">
                        {booking.event.title} - {new Date(booking.event.createdAt).toLocaleDateString()}
                    </div>
                    <div className="bookings__item-action">
                        <button className="btn" onClick={props.onDelete.bind(this, booking._id)}>Cancel</button>
                    </div>
                </li>
            );
        })}
    </ul>
);

export default bookingList;