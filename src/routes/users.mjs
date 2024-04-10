import { Router } from "express";
import { query, validationResult, body, matchedData, checkSchema } from 'express-validator';
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexByUserID } from '../utils/middlewares.mjs';
import { createUservalidationSchema } from "../utils/validationSchema.mjs";
import { User } from "../mongoose/schemas/user.mjs";
const router = Router();

router.get(
    '/api/users',
    query( "filter" ).isString().notEmpty().withMessage( "must not be empty" ).isLength( { min: 3, max: 10 } ).withMessage( "must be 3-10 characters" ),
    ( request, response ) => {
        request.sessionStore.get( request.session.id, ( err, data ) => {
            if ( err ) {
                console.log( err );
                throw err;
            }
            console.log( data );
        } )
        const result = validationResult( request );
        console.log( result );
        const { query: { filter, value } } = request;
        if ( !filter && !value ) return response.send( mockUsers );

        if ( filter && value ) return response.send(
            mockUsers.filter( ( user ) => user[ filter ].includes( value ) )
        );

        response.status( 200 ).send( mockUsers );
    } );

router.get( '/api/users/:id', resolveIndexByUserID, ( request, response ) => {

    const { findUserIndex } = request;
    const findUser = mockUsers[ findUserIndex ];
    if ( !findUser ) return response.sendStatus( 404 );
    return response.send( findUser );
} );
// for local text db users:
// router.post( '/api/users',
//     checkSchema( createUservalidationSchema ),
//     ( request, response ) => {

//         const result = validationResult( request );

//         if ( !result.isEmpty() ) {
//             return response.status( 400 ).send( { errors: result.array() } )
//         }
//         const data = matchedData( request );
//         // console.log( data );
//         const newUser = { id: mockUsers[ mockUsers.length - 1 ].id + 1, ...data };
//         mockUsers.push( newUser );
//         return response.status( 201 ).send( newUser );
//     } );

// for MongoDB users:
router.post( '/api/users',
    checkSchema( createUservalidationSchema ),
    async ( request, response ) => {

        const result = validationResult( request );

        if ( !result.isEmpty() )
            return response.status( 400 ).send( result.array() );

        const data = matchedData( request );

        const newUser = new User( data );
        try {
            const saveUser = await newUser.save();
            return response.status( 201 ).send( saveUser );
        } catch ( error ) {
            console.log( error );
            return response.sendStatus( 400 );
        }
    } );

// PUT REQUEST :
router.put( '/api/users/:id', resolveIndexByUserID, ( request, response ) => {

    const { body, findUserIndex } = request;
    mockUsers[ findUserIndex ] = { id: mockUsers[ findUserIndex ].id, ...body };
    return response.sendStatus( 204 );
} );
//  PATCH REQUEST :
router.patch( '/api/users/:id', resolveIndexByUserID, ( request, response ) => {

    const { body, findUserIndex } = request;
    mockUsers[ findUserIndex ] = { ...mockUsers[ findUserIndex ], ...body };
    return response.sendStatus( 204 );
} );

// DELETE REQUEST : 
router.delete( '/api/users/:id', resolveIndexByUserID, ( request, response ) => {

    const { findUserIndex } = request;
    mockUsers.splice( findUserIndex, 1 );
    return response.sendStatus( 204 );
} );


export default router;