const logger = require('../utils/logger');

const helloController = {
    getHello: async (req, res) => {
        try {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'Hello, there!',
                status: 'success'
            }));
        } catch (error) {
            logger.emit('error', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'Internal server error',
                status: 'error'
            }));
        }
    }
};

module.exports = helloController;