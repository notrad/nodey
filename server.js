const http = require('http');
const config = require('./src/config/config');
const handleHelloRoutes = require('./src/routes/helloRoutes');
const handleFileRoutes = require('./src/routes/fileRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
const logger = require('./src/utils/logger');
const handleMailRoutes = require('./src/routes/mailRoutes');
const handleMetaDataRotes = require('./src/routes/metaRoutes');

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'GET' || req.method === 'POST') {
        const handled = await handleHelloRoutes(req, res) || handleFileRoutes(req, res) || handleMailRoutes(req, res) || handleMetaDataRotes(req, res);

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