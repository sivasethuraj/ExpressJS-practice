import passport from "passport";
import { Strategy } from "passport-github2";
import { githubUser } from "../mongoose/schemas/github-user.mjs";


passport.serializeUser( ( user, done ) => {
    console.log( "serializeuser", user.id );
    done( null, user.id );
} );

passport.deserializeUser( async ( id, done ) => {
    try {
        console.log( "deserializeUser", id );
        const findUser = await githubUser.findById( id );
        console.log( "deserializeUser findUser: ", findUser );
        return findUser ? done( null, findUser ) : done( null, null );
    } catch ( error ) {
        done( error, null );
    }
} );

export default passport.use(
    new Strategy( {
        clientID: "8989df9a2e37993ecb0f",
        clientSecret: "fe3bdf201550510d05e2cf33121e3faf9bc92827",
        callbackURL: "http://localhost:3000/api/auth/github/redirect",
        scope: [ "user: email" ],
    },
        async ( accessToken, refreshToken, profile, done ) => {

            let findUser;
            try {
                findUser = githubUser.findOne( { githubId: profile.id } );

                if ( !findUser.id ) {
                    console.log( "didnt found user" )
                    const newUser = new githubUser( {
                        username: profile.username,
                        githubId: profile.id,
                    } );
                    const newSavedUser = await newUser.save();
                    console.log( "newSavedUser: ", newSavedUser );
                    return done( null, newSavedUser );
                }
                console.log( "findUser: ", findUser );
                return done( null, findUser );
            } catch ( error ) {
                return done( error, null );
            }

        }
    ),
);