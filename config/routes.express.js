var userRouter = require('../api/user/user.router');

module.exports = function(app) {
    app.use('/', userRouter);

/* This should be last middleware */
    app.use('*', function(req, res) {
        res.status(404).json({
            message: 'Nothing Found.  Youre way off the path.'
        });
    });

}