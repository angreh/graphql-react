const express           = require( 'express' ),
      bodyParser        = require( 'body-parser' ),
      graphqlHTTP       = require( 'express-graphql' ),
      mongoose          = require( 'mongoose' )

const graphqlSchema     = require( './graphql/schema' ),
      graphqlResolvers  = require( './graphql/resolvers' ),
      isAuth            = require( './middleware/is-auth' )

const app = express()

app.use( bodyParser.json() )

app.use ( ( req, res, next ) => {

    res.setHeader( 'Access-Control-Allow-Origin', '*' )
    res.setHeader( 'Access-Control-Allow-Methods', 'POST,GET,OPTIONS' )
    res.setHeader( 'Access-Control-Allow-Headers', 'Content-Type, Authorization' )

    if ( req.method === 'OPTIONS' ) return res.sendStatus(200);

    next();
})

app.use( isAuth )

app.use( '/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}))

mongoose
.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clustertest-19ans.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
.then(()=>{
    app.listen( 8000 )
})
.catch(err=>{
    console.log(err)
})

//angreh OBYFjC4RSfNL1TQT
