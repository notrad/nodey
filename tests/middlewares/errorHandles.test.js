const errorHandler = require('../../src/middlewares/errorHandler');
const logger = require('../../src/utils/logger');

jest.spyOn(logger, 'emit').mockImplementation(() => { });

describe('errorHandler middlewares', () => {
    describe('notFound', () => {
        it('should respond with 404 and log failure', () => {
            const res = {
                writeHead: jest.fn(),
                end: jest.fn()
            };
            errorHandler.notFound(res);

            expect(res.writeHead).toHaveBeenCalledWith(404, { 'Content-Type': 'application/json' });
            expect(res.end).toHaveBeenCalledWith(expect.stringContaining('not found'));
            expect(logger.emit).toHaveBeenCalledWith('failure', expect.any(Object));
        });
    });

    describe('methodNotAllowed', () => {
        it('should respond with 405 and log failure', () => {
            const res = {
                writeHead: jest.fn(),
                end: jest.fn()
            };

            errorHandler.methodNotAllowed(res);

            expect(res.writeHead).toHaveBeenCalledWith(405, { 'Content-Type': 'application/json' });
            expect(res.end).toHaveBeenCalledWith(expect.stringContaining('Method not allowed'));
            expect(logger.emit).toHaveBeenCalledWith('failure', expect.any(Object));
        });
    });
});