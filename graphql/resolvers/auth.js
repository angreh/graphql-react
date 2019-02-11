const bcrypt = require( 'bcryptjs' ),
      User = require( '../../models/user' ),
      jwt = require( 'jsonwebtoken' )

module.exports = {
    createUser: async args => {
        try {
            // verify if already exist a user with this email
            const existingUser = await User.findOne({ email: args.userInput.email })
            if ( existingUser ) { throw new Error('User exists already') }

            // save new user
            hashedPassword = await bcrypt.hash( args.userInput.password, 12 )
            const newUser = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            const createdUser = await newUser.save()

            // return created user
            return { ...createdUser._doc, _id: createdUser.id, password: null }
        } catch ( err ) {
            throw err;
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if( !user ) {
            throw new Error( 'User does not exist' )
        }
        const isEqual = await bcrypt.compare( password, user.password )
        if( !isEqual ) {
            throw new Error( 'Password is incorrect' )
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email }, 
            'somesecretkey',
            { expiresIn: '1h' }
        )
        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        }
    }
}