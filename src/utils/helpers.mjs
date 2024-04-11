import bcrypt from 'bcrypt';

export const hashPassword = ( passwd ) => {

    return bcrypt.hashSync( passwd, 10 );
}

export const comparePasswd = ( plain, hashed ) => {
    return bcrypt.compareSync( plain, hashed );
}