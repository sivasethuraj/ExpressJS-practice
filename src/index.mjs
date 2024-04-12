import express, { request, response } from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes/index.mjs';
import session from 'express-session';
import { mockUsers } from './utils/constants.mjs';
import passport from 'passport';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
// import "./strategies/local-strategy.mjs";
import "./strategies/github-strategy.mjs";

const app = express();

mongoose.connect( 'mongodb://localhost/express_tutorial' )
    .then( () => console.log( "connected to database..." ) )
    .catch( ( err ) => console.log( `Error : ${err}` ) );

app.use( express.json() );
app.use( cookieParser( "sivasecret" ) );
app.use( session( {
    secret: "sivasecret",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60,
    },
    store: MongoStore.create( {
        client: mongoose.connection.getClient()
    } ),
} ) );
app.use( passport.initialize() );
app.use( passport.session() );
app.use( routes );
app.post(
    '/api/auth',
    passport.authenticate( 'local' ),
    ( request, response ) => {
        response.sendStatus( 200 );
    } );

const PORT = process.env.PORT || 3000;

app.get( '/', ( request, response ) => {
    console.log( request.session.id );

    request.session.visited = true;
    response.cookie( "Hello", "World", { maxAge: 30000, signed: true } );
    response.status( 201 ).send( { msg: 'Hello!' } );
} );

app.post( '/api/auth', ( request, response ) => {
    const { body: { username, password } } = request;
    const findUser = mockUsers.find( ( user => user.username === username ) );
    if ( !findUser || findUser.password !== password )
        return response.status( 401 ).send( { msg: "BAD CREDENTIALS !" } );

    request.session.user = findUser;
    return response.status( 200 ).send( findUser );
} );

app.get( '/api/auth/status', ( request, response ) => {

    console.log( request.user );

    return request.user
        ? response.status( 200 ).send( request.user )
        : response.status( 401 ).send( { msg: "NOT AUTHENTICATED!" } );
    // request.sessionStore.get( request.session.id, ( err, data ) => {
    //     console.log( data );
    // } )
    // return request.session.user
    //     ? response.status( 200 ).send( request.session.user )
    //     : response.status( 401 ).send( { msg: "NOT AUTHENTICATED!" } );
} );

app.post( '/api/cart', ( request, response ) => {
    if ( !request.session.user )
        return response.sendStatus( 401 );
    const { body: item } = request;

    const { cart } = request.session;
    if ( cart ) {
        cart.push( item );
    } else {
        request.session.cart = [ item ];
    }

    return response.status( 201 ).send( item );
} );

app.get( '/api/cart', ( request, response ) => {
    if ( !request.session.user )
        return response.sendStatus( 401 );

    return response.status( 200 ).send( request.session.cart ?? [] );
} );

app.post( '/api/auth/logout', ( request, response ) => {
    if ( !request.user )
        return response.sendStatus( 401 );

    request.logOut( ( err ) => {
        if ( err )
            return response.sendStatus( 401 );
        response.sendStatus( 200 );
    } )
} );


app.get( '/api/auth/github',
    passport.authenticate( 'github', { scope: [ 'user:email' ] } ) );

app.get( '/api/auth/github/redirect',
    passport.authenticate( 'github', { failureRedirect: '/api/users' } ),
    ( req, res ) => {
        // Successful authentication, redirect home.
        res.redirect( '/' );
    } );

app.listen( PORT, () => {
    console.log( `Running on Port ${PORT} on ${new Date()}` )
} )


// CLIENT_ID = 8989df9a2e37993ecb0f
// CLIENT_SECRET = fe3bdf201550510d05e2cf33121e3faf9bc92827
// REDIRECT_URL = http://localhost:3000/api/auth/github/redirect 