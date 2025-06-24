const metaController = require('../controllers/metaController');

const handleMetaDataRotes = (req, res) => {
    if (req.url === '/api/meta-data' && req.method === 'GET') {
        metaController.getMetaData(req, res);
        return true;
    }
    return false;
};

module.exports = handleMetaDataRotes;