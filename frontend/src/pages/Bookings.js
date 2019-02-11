import React, { Component } from 'react';

import AuthContext from '../context/auth-context';
import Spinner from '../components/Spiner/Spiner';
import BookingList from '../components/Bookings/BookingList/BookingList';

class BookingsPage 
extends Component 
{
    state = {
        isLoading: false,
        bookings: []
    };

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchBookings();
    }

    fetchBookings = async () => {

        this.setState({isLoading:true});

        const requestBody = {
            query: `
                query {
                    bookings
                    {
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


        try {
            // const token = 
            const res = await fetch(
                'http://localhost:8000/graphql',
                {
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.context.token
                    }
                }
            );

            if ( res.status !== 200 && res.status !== 201 ) 
                throw new Error('Failed');

            const resData = await res.json();
            const bookings = resData.data.bookings;
            this.setState({bookings});
        }
        catch( err ) {
            console.log(err);
        };
        this.setState({isLoading:false});
    }

    deleteBookingHandler = async bookingId => {

        this.setState({isLoading:true});

        const requestBody = {
            query: `
                mutation {
                    cancelBooking(bookingId: "${bookingId}")
                    {
                        _id
                        title
                    }
                }
            `
        };


        try {
            // const token = 
            const res = await fetch(
                'http://localhost:8000/graphql',
                {
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.context.token
                    }
                }
            );

            if ( res.status !== 200 && res.status !== 201 ) 
                throw new Error('Failed');

            this.setState( prevState => {
                const updatedBookings = prevState.bookings.filter( booking => {
                    return booking._id !== bookingId;
                });
                return { bookings: updatedBookings };
            });
        }
        catch( err ) {
            console.log(err);
        };
        this.setState({isLoading:false});
    }

    render() {
        return (
            <React.Fragment>
                {this.state.isLoading ? <Spinner /> : (
                    <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler} />
                )}
            </React.Fragment>
        );
    }
}

export default BookingsPage;