const logger = require('../utils/logger');
const nodemailer = require('nodemailer');

const mailController = {
    sendMail: async (req, res) => {
        try {
            res.writeHead(202, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'added to the queue!',
                status: 'success'
            }));

            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'elton.muller@ethereal.email',
                    pass: 'kMydH92WGUjeernRzx'
                }
            });

            const mailOptions = {
                from: 'elton.muller@ethereal.email',
                to: 'anoopbevendcunha@gmail.com',
                subject: 'Sending Email using Node.js',
                text: 'That was easy!'
            };

            try {
                let info = await transporter.sendMail(mailOptions);
                logger.emit('info', info.response);
            } catch (error) {
                logger.emit('error', error);
            }
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

module.exports = mailController;