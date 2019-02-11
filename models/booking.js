const moogose = require( 'mongoose' )

const Schema = moogose.Schema

const bookingSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
{
    timestamps: true
})

module.exports = moogose.model( 'Booking', bookingSchema )