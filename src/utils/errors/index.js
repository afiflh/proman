class CustomError extends Error {
    constructor(message = 'Internal Server Error', statusCode = 500) {
        super(message);
        this.statusCode = statusCode;

        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;

        // Capture stack trace, excluding constructor call from it.
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = { CustomError };
