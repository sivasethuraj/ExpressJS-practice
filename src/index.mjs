import express, { request, response } from 'express';

const app = express();
app.use( express.json() )

const PORT = process.env.PORT || 3000;

const mockUsers = [
    { id: 1, username: "anson", displayName: "Anson" },
    { id: 2, username: "jack", displayName: "Jack" },
    { id: 3, username: "adam", displayName: "Adam" },
    { id: 4, username: "tina", displayName: "Tina" },
    { id: 5, username: "jason", displayName: "Jason" },
    { id: 6, username: "henry", displayName: "Henry" },
    { id: 7, username: "marilyn", displayName: "Marilyn" },
];

app.get( '/', ( request, response ) => {
    response.status( 201 ).send( { msg: 'Hello!' } );
} );

app.get( '/api/users', ( request, response ) => {
    const { query: { filter, value } } = request;
    if ( !filter && !value ) return response.send( mockUsers );

    if ( filter && value ) return response.send(
        mockUsers.filter( ( user ) => user[ filter ].includes( value ) )
    );

    response.status( 200 ).send( mockUsers );
} );

app.get( '/api/users/:id', ( request, response ) => {

    const parseId = parseInt( request.params.id );
    if ( isNaN( parseId ) ) {
        return response.status( 400 ).send( { msg: 'Bad Request' } );
    }
    const findUser = mockUsers.find( ( user ) => user.id === parseId );
    if ( !findUser ) return response.sendStatus( 404 );
    return response.send( findUser );
} );

app.get( '/api/products', ( request, response ) => {
    response.send( [ { id: 123, name: 'chicken Breast', price: 12.99 } ] )
} )

app.post( '/api/users', ( request, response ) => {

    const { body } = request;
    const newUser = { id: mockUsers[ mockUsers.length - 1 ].id + 1, ...body };
    mockUsers.push( newUser );
    return response.status( 201 ).send( newUser );
} );


app.put( '/api/users/:id', ( request, response ) => {

    const { body, params: { id } } = request;
    const parseID = parseInt( id );
    if ( isNaN( parseID ) ) return response.sendStatus( 400 );

    const findUserIndex = mockUsers.findIndex( ( user ) => user.id === parseID );

    if ( findUserIndex === -1 ) return response.sendStatus( 404 );

    mockUsers[ findUserIndex ] = { id: parseID, ...body };
    return response.sendStatus( 204 );
} )

app.listen( PORT, () => {
    console.log( `Running on Port ${PORT} on ${new Date()}` )
} )