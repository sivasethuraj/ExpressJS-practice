import express from 'express';

import usersRouter from './routes/users.mjs';
import productRouter from './routes/products.mjs';

const app = express();
app.use( express.json() );
app.use( usersRouter );
app.use( productRouter );

const PORT = process.env.PORT || 3000;

app.get( '/', ( request, response ) => {
    response.status( 201 ).send( { msg: 'Hello!' } );
} );


app.listen( PORT, () => {
    console.log( `Running on Port ${PORT} on ${new Date()}` )
} )