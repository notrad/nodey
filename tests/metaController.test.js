const metaController = require('../src/controllers/metaController');
const logger = require('../src/utils/logger');

jest.spyOn(logger, 'emit').mockImplementation(() => { });

describe('metaController', () => {
    it('should respond with metadata (success)', () => {
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

        metaController.getMetaData(req, res);

        expect(statusCode).toBe(200);
        expect(headers['Content-Type']).toBe('application/json');
        const meta = JSON.parse(body);
        expect(meta).toHaveProperty('nodeVersion');
        expect(meta).toHaveProperty('platform');
        expect(meta).toHaveProperty('arch');
        expect(meta).toHaveProperty('memoryUsage');
        expect(meta).toHaveProperty('cpuUsage');
        expect(meta).toHaveProperty('pid');
        expect(meta).toHaveProperty('cwd');
        expect(meta).toHaveProperty('env');
        expect(meta).toHaveProperty('title');
    });

    it('should handle errors gracefully', () => {
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

        metaController.getMetaData(req, res);

        expect(logger.emit).toHaveBeenCalledWith('error', expect.any(Error));
        expect(res.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'application/json' });
        expect(res.end).toHaveBeenCalledWith(expect.stringContaining('Internal server error'));
    });
});