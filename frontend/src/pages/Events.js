import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spiner/Spiner';

import './Events.css';

class EventsPage 
extends Component 
{
    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectdEvent: null
    };

    isActive = true;

    static contextType = AuthContext;

    constructor ( props )
    {
        super(props);
        
        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }

    componentDidMount()
    {
        this.fetchEvents();
    }

    componentWillUnmount() 
    {
        this.isActive = false;
    }

    startCreateEventHandler = () => {
        this.setState({ creating: true });
    }

    modalConfirmHandler = async () => {
        this.setState({ creating: false });

        const title = this.titleElRef.current.value;
        const price = +this.priceElRef.current.value;
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;

        if (
            title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0
        ) {
            return;
        }

        const event = {
            title,
            price,
            date,
            description
        };

        const requestBody = {
            query: `
                mutation {
                    createEvent( eventInput: {title:"${event.title}", description:"${event.description}", price: ${event.price}, date:"${event.date}"})
                    {
                        _id
                        title
                        description
                        date
                        price
                    }
                }
            `
        };

        console.log(requestBody);

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
            this.setState( prevState => {
                const updatedEvents = [...prevState.events];
                updatedEvents.push({
                    _id: resData.data.createEvent._id,
                    title: resData.data.createEvent.title,
                    description: resData.data.createEvent.description,
                    date: resData.data.createEvent.date,
                    price: resData.data.createEvent.price,
                    creator: {
                        _id: this.context.userId
                    }
                });
                return {events: updatedEvents};
            });
            this.fetchEvents();
        }
        catch( err ) {
            console.log(err);
        };
    };

    modalCancelHandler = () => {
        this.setState({creating: false, selectdEvent: null });
    };

    async fetchEvents() {
        this.setState({isLoading:true});
        const requestBody = {
            query: `
                query {
                    events
                    {
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


        try {
            // const token = 
            const res = await fetch(
                'http://localhost:8000/graphql',
                {
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if ( res.status !== 200 && res.status !== 201 ) 
                throw new Error('Failed');

            const resData = await res.json();
            const events = resData.data.events;
            
            if ( this.isActive ) this.setState({events});
        }
        catch( err ) {
            console.log(err);
        };
        if ( this.isActive ) this.setState({isLoading:false});
    }

    showDetailHandler = eventId => {
        this.setState(prevState => {
            const selectdEvent = prevState.events.find( e => e._id === eventId );
            return {selectdEvent: selectdEvent};
        });
    }

    bookEventHandler = async () => {

        if ( !this.context.token ) {
            this.setState({selectdEvent:null});
            return;
        }

        const requestBody = {
            query: `
                mutation {
                    bookEvent(eventId: "${this.state.selectdEvent._id}")
                    {
                        _id
                        createdAt
                        updatedAt
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
           console.log(resData);
           this.setState({selectdEvent:null});
        //    const events = resData.data.events;
        //     this.setState({events});
        }
        catch( err ) {
            console.log(err);
        };
        this.setState({isLoading:false});
    }

    render() {
        return (
            <React.Fragment>
                {this.state.creating && (
                    <React.Fragment>
                        <Backdrop />
                        <Modal 
                            title="Add Event" 
                            canCancel 
                            canConfirm
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.modalConfirmHandler}
                            confirmText="Confirm"
                        >
                            <form>
                                <div className="form-control">
                                    <label htmlFor="title">Title</label>
                                    <input 
                                        type="text" 
                                        id="title" 
                                        ref={this.titleElRef}
                                    ></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="price">Price</label>
                                    <input 
                                        type="text" 
                                        id="price"
                                        ref={this.priceElRef}
                                    ></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="date">Date</label>
                                    <input 
                                        type="datetime-local" 
                                        id="date"
                                        ref={this.dateElRef}
                                    ></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="description">Description</label>
                                    <textarea 
                                        id="description"
                                        rows="4"
                                        ref={this.descriptionElRef}
                                    ></textarea>
                                </div>
                            </form>
                        </Modal>
                    </React.Fragment>
                )}
                {this.state.selectdEvent && (
                    <React.Fragment>
                        <Backdrop />
                        <Modal 
                            title={this.state.selectdEvent.title} 
                            canCancel 
                            canConfirm
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.bookEventHandler}
                            confirmText={this.context.token ? 'Book' : 'Confirm'}
                        >
                            <h1>{this.state.selectdEvent.title}</h1>
                            <h2>{this.state.selectdEvent.price} - {new Date(this.state.selectdEvent.date).toLocaleDateString('pt-BR')}</h2>
                            <p>{this.state.selectdEvent.description}</p>
                        </Modal>
                    </React.Fragment>
                )}
                {this.context.token && (<div className="events-control">
                    <p>Share your own events!</p>
                    <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
                </div>)}
                {this.state.isLoading ?
                ( 
                    <Spinner />
                ) : (
                    <EventList 
                        events={this.state.events} 
                        authUserId={this.context.userId} 
                        onViewDetail={this.showDetailHandler}
                    />
                )}
            </React.Fragment>
        );
    }
}

export default EventsPage;