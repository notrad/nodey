const mailController = require('../controllers/mailController');

const handleMailRoutes = (req, res) => {
    if (req.url === '/api/mail' && req.method === 'GET') {
        mailController.sendMail(req, res);
        return true;
    }
    return false;
};

module.exports = handleMailRoutes;