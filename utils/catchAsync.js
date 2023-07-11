// Wraps the async functions to catch the errors
// Func is what you pass in. Such as req res after hitting a route  
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}