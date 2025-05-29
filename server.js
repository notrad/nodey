const http = require('http');
const config = require('./src/config/config');
const handleHelloRoutes = require('./src/routes/helloRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
const logger = require('./src/utils/logger');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'GET') {
        const handled = handleHelloRoutes(req, res);

        if (!handled) {
            logger.emit('failure', {
                type: 'route_not_found',
                path: req.url,
                method: req.method
            });
            errorHandler.notFound(res);
        }
    } else {
        logger.emit('failure', {
            type: 'method_not_allowed',
            path: req.url,
            method: req.method
        });
        errorHandler.methodNotAllowed(res);
    }
});

server.listen(config.port, () => {
    console.log(`Server is running on port: ${config.port}`);
}).on('error', (error) => {
    logger.emit('error', error);
});