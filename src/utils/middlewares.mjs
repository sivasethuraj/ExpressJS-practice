import { mockUsers } from "./constants.mjs";

export const resolveIndexByUserID = ( request, response, next ) => {

    const { params: { id } } = request;
    const parseID = parseInt( id );

    if ( isNaN( parseID ) ) return response.sendStatus( 400 );

    const findUserIndex = mockUsers.findIndex( ( user ) => user.id === parseID );

    if ( findUserIndex === -1 ) return response.sendStatus( 404 );
    request.findUserIndex = findUserIndex;
    next();
}