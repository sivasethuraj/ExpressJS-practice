import { Router } from "express";

const router = Router();

router.get( '/api/products', ( request, response ) => {
    // console.log( request.headers.cookie );
    // console.log( request.cookies );
    // console.log( request.signedCookies );

    if ( request.signedCookies.Hello && request.signedCookies.Hello === "World" ) {

        return response.send( [ { id: 123, name: 'chicken Breast', price: 12.99 } ] );
    }
    return response.status( 403 )
        .send( { msg: "Sorry you need correct cookies!" } );
} );


export default router;