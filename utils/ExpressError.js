// Extends regular built in error
class ExpressError extends Error {
    constructor(message, statusCode) {
        super(); // So we can call on the parent properties (i think)
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;