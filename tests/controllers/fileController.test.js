const logger = require('../../src/utils/logger');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

jest.spyOn(logger, 'emit').mockImplementation(() => { });

const fileName = 'test.pdf';
const uploadsDir = path.join(__dirname, '../uploads');
const filePath = path.join(uploadsDir, fileName);

jest.spyOn(fs, 'access').mockImplementation(async (p) => {
    if (p === filePath) return;
    throw new Error('not found');
});
jest.spyOn(fs, 'stat').mockImplementation(async (p) => {
    if (p === filePath) return { size: 10 };
    throw new Error('not found');
});
jest.spyOn(fsSync, 'createReadStream').mockReturnValue({
    pipe: jest.fn()
});

const fileController = require('../../src/controllers/fileController');


describe('downloadFile', () => {
    test('should respond with file (success)', async () => {
        fileController.uploadDir = uploadsDir;

        const req = { url: `/api/download?file=${encodeURIComponent(fileName)}` };
        let statusCode, headers;
        const res = {
            writeHead: (code, hdrs) => {
                statusCode = code;
                headers = hdrs;
            },
            end: jest.fn(),
            write: jest.fn(),
            on: jest.fn()
        };

        await fileController.downloadFile(req, res);

        expect(statusCode).toBe(200);
        expect(headers['Content-Type']).toBe('application/pdf');
        expect(headers['Content-Disposition']).toContain(fileName);
    });

    test('should handle file not found error', async () => {
        jest.spyOn(fs, 'access').mockRejectedValue(new Error('not found'));
        const req = { url: '/api/download?file=missing.txt' };
        const res = {
            writeHead: jest.fn(),
            end: jest.fn()
        };

        await fileController.downloadFile(req, res);

        expect(logger.emit).toHaveBeenCalledWith('error', expect.any(Error));
        expect(res.writeHead).toHaveBeenCalledWith(404, { 'Content-Type': 'application/json' });
        expect(res.end).toHaveBeenCalledWith(expect.stringContaining('File not found'));
    });
});