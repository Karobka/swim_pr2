var userRouter = require('../api/user/user.router');
var authRouter = require('../api/auth/auth.router');

module.exports = function(app) {
    app.use('/auth', authRouter);
    app.use('/users', userRouter);

/* This should be last middleware */
    app.use('*', function(req, res) {
        res.status(404).json({
            message: 'Nothing Found.  Youre way off the path.'
        });
    });

}