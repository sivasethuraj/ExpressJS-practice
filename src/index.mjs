import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes/index.mjs';

const app = express();
app.use( express.json() );
app.use( cookieParser( "sivasecret" ) );
app.use( routes );

const PORT = process.env.PORT || 3000;

app.get( '/', ( request, response ) => {
    response.cookie( "Hello", "World", { maxAge: 30000, signed: true } );
    response.status( 201 ).send( { msg: 'Hello!' } );
} );


app.listen( PORT, () => {
    console.log( `Running on Port ${PORT} on ${new Date()}` )
} )