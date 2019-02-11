const DataLoader = require('dataloader')

const Event = require( '../../models/event' ),
      User  = require( '../../models/user' ),
      { dateToString } = require( '../../helpers/date' )

const eventLoader = new DataLoader( eventsIds => {
    return events(eventsIds)
})

const userLoader = new DataLoader(userIds => {
    return User.find({_id: {$in: userIds}})
})

const user = async userId => {
    try {
        const user = await userLoader.load( userId.toString() )
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: eventLoader.load.bind( this, user._doc.createdEvents )
        }
    } catch( err ) {
        throw err
    }
}

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        return events.map( event => {
            return transformEvent( event )
        })
    } catch ( err ) {
        throw err
    }
}

const singleEvent = async eventId => {
    try {
        const event = await eventLoader.load(eventId.toString())
        return event
    } catch( err ) {
        throw err
    }
}

const transformEvent = event => {
    return { 
        ...event._doc, 
        _id: event.id,
        date: dateToString( event._doc.date ),
        creator: user.bind( this, event.creator )
    }
}
exports.transformEvent = transformEvent

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind( this, booking._doc.user ),
        event: singleEvent.bind( this, booking._doc.event ),
        createdAt: dateToString( booking._doc.createdAt ),
        updatedAt: dateToString( booking._doc.updatedAt )
    }
}
exports.transformBooking = transformBooking