const fileController = require('../controllers/fileController');

const handleFileRoutes = (req, res) => {
    if (req.url === '/api/upload' && req.method === 'POST') {
        fileController.uploadFile(req, res);
        return true;
    }

    if (req.url.startsWith('/api/download') && req.method === 'GET') {
        fileController.downloadFile(req, res);
        return true;
    }

    return false;
};

module.exports = handleFileRoutes;