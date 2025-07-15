const helloController = require('../src/controllers/helloController');
const logger = require('../src/utils/logger');

jest.spyOn(logger, 'emit').mockImplementation(() => { });

describe('helloController', () => {
    it('should respond with a hello message', async () => {
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

        await helloController.getHello(req, res);

        expect(statusCode).toBe(200);
        expect(headers['Content-Type']).toBe('application/json');
        expect(JSON.parse(body)).toEqual({
            message: 'Hello, there!',
            status: 'success'
        });
    });

    it('should handle errors gracefully', async () => {
        const req = {};
        const res = {
            writeHead: jest.fn(),
            end: jest.fn(),
        };

        let callCount = 0;
        res.writeHead.mockImplementation(() => {
            callCount++;
            if (callCount === 1) throw new Error('fail');
        });

        await helloController.getHello(req, res);

        expect(logger.emit).toHaveBeenCalledWith('error', expect.any(Error));
        expect(res.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'application/json' });
        expect(res.end).toHaveBeenCalledWith(expect.stringContaining('Internal server error'));
    });
});