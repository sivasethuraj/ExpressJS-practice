import mongoose from 'mongoose';

const githubUserSchema = new mongoose.Schema( {

    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    githubId: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    }
} );

export const githubUser = mongoose.model( "githubUser", githubUserSchema );