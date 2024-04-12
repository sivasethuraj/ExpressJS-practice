import passport from "passport";
import { Strategy } from "passport-github2";
import { githubUser } from "../mongoose/schemas/github-user.mjs";
import dotenv from "dotenv";
dotenv.config();


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
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/auth/github/redirect",
        scope: [ "user: email" ],
    },
        async ( accessToken, refreshToken, profile, done ) => {

            let findUser;
            try {
                findUser = githubUser.findOne( { githubId: profile.id } );

                if ( !findUser.githubId ) {
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