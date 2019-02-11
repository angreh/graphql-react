const Event = require( '../../models/event' ),
      User  = require( '../../models/user' ),
      { transformEvent } = require( './merge' )
      
module.exports = {
    events: async () => {
        try {
            const events = await Event.find()

            return events.map( event => {
                return transformEvent( event )
            })
        } catch ( err ) {
            throw err
        }
    },
    createEvent: async ( args, req ) => {
        if ( !req.isAuth ) {
            throw new Error( 'Unauthenticated' )
        }
        try {
            // create a event
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: req.userId
            })
            const result = await event.save()

            // prepare created event for return
            const createdEvent = transformEvent( result )

            // insert relation on user document
            const creator = await User.findById( req.userId )
            if ( !creator ) { throw new Error('User not found') }
            creator.createdEvents.push(event)
            creator.save()
                    
            // return created event
            return createdEvent
        } catch ( err ) {
            throw err
        }
    }
}