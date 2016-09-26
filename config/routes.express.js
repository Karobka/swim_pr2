var userRouter = require('../api/user/user.router');
var authRouter = require('../api/auth/auth.router');

module.exports = function (app) {
    app.use('/auth', authRouter);
    app.use('/users', userRouter);

    app.use(function (req, res, next) {
        res.send('404: Page not Found.  Please try again!', 404);
    });
    app.use(function (error, req, res, next) {
        res.send('500: Internal Server Error.  Please try again!', 500);
    });
}