export const createUservalidationSchema = {
    username: {
        isLength: {
            options: {
                min: 4,
                max: 32
            },
            errorMessage: "username must be 5-32 characters"
        },
        notEmpty: {
            errorMessage: "username cannot be empty",
        },
        isString: {
            errorMessage: "username must be string"
        },
    },
    displayName: {
        isLength: {
            options: {
                min: 4,
                max: 32
            },
            errorMessage: "displayName must be 5-32 characters"
        },
        notEmpty: {
            errorMessage: "displayName cannot be empty",
        },
        isString: {
            errorMessage: "displayName must be string"
        },
    }
};