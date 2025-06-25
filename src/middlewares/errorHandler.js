const logger = require('../utils/logger');

const errorHandler = {
    notFound: (res) => {
        logger.emit('failure', {
            type: '404_not_found',
            timestamp: new Date().toISOString()
        });
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Route not found',
            status: 'error'
        }));
    },

    methodNotAllowed: (res) => {
        logger.emit('failure', {
            type: '405_method_not_allowed',
            timestamp: new Date().toISOString()
        });
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Method not allowed',
            status: 'error'
        }));
    }
};

module.exports = errorHandler;