const http = require('http');
const config = require('./src/config/config');
const handleHelloRoutes = require('./src/routes/helloRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'GET') {
        const handled = handleHelloRoutes(req, res);
        
        if (!handled) {
            errorHandler.notFound(res);
        }
    } else {
        errorHandler.methodNotAllowed(res);
    }
});

server.listen(config.port, () => {
    console.log(`Server is running on port: ${config.port}`);
});