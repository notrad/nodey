const helloController = require('../controllers/helloController');

const handleHelloRoutes = (req, res) => {
    if (req.url === '/api/hello' && req.method === 'GET') {
        helloController.getHello(req, res);
        return true;
    }
    return false;
};

module.exports = handleHelloRoutes;