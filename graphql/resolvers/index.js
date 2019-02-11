const authResolver      = require( './auth' ),
      eventResolver     = require( './events' ),
      bookingResolver   = require( './booking' )

const rootResolver = {
    ...authResolver,
    ...eventResolver,
    ...bookingResolver
}

module.exports = rootResolver