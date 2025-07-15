const mailController = require('../src/controllers/mailController');
const logger = require('../src/utils/logger');
const nodemailer = require('nodemailer');

jest.spyOn(logger, 'emit').mockImplementation(() => { });
jest.mock('nodemailer');

describe('mailController', () => {
    beforeEach(() => {
        nodemailer.createTransport.mockReturnValue({
            sendMail: jest.fn().mockResolvedValue({ response: 'OK' })
        });
    });

    it('should respond with queue message (success)', async () => {
        const req = {};
        let statusCode, headers, body;
        const res = {
            writeHead: (code, hdrs) => {
                statusCode = code;
                headers = hdrs;
            },
            end: (data) => {
                body = data;
            }
        };

        await mailController.sendMail(req, res);

        expect(statusCode).toBe(202);
        expect(headers['Content-Type']).toBe('application/json');
        expect(JSON.parse(body)).toEqual({
            message: 'added to the queue!',
            status: 'success'
        });
    });
    
    it('should handle errors gracefully', async () => {
        const req = {};
        const res = {
            writeHead: jest.fn(),
            end: jest.fn()
        };

        let callCount = 0;
        res.writeHead.mockImplementation(() => {
            callCount++;
            if (callCount === 1) throw new Error('fail');
        });

        await mailController.sendMail(req, res);

        expect(logger.emit).toHaveBeenCalledWith('error', expect.any(Error));
        expect(res.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'application/json' });
        expect(res.end).toHaveBeenCalledWith(expect.stringContaining('Internal server error'));
    });
});