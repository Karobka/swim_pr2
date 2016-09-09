module.exports = {
    EXPRESS: {
        PORT: function(env) {
            switch (env) {
                case 'development':
                    return 5000;
                    break;
                case 'production':
                    return process.env.PORT || 8080;
                case 'test':
                    return 4000;
                    break;
                default:
                    return 5000;
            }
        }
    },

    MONGODB: {
        URI: function(env) {

            switch (env) {
                case 'development':
                    return 'mongodb://localhost/swim_pr2';
                    break;
                case 'production':
                    return process.env.MONGODB_URI || 'mongodb://localhost/swim_pr2';
                    break;
                case 'test':
                    return 'mongodb://localhost/swim_pr2';
                    break;
                default:
                    return 'mongodb://localhost/swim_pr2'
            }
        }
    }
};