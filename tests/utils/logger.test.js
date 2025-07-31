const fs = require('fs').promises;
const path = require('path');
const logger = require('../../src/utils/logger');
const os = require('os');

describe('Logger', () => {
    let logsDir;
    let logFile;

    beforeEach(async () => {
        logsDir = path.join(os.tmpdir(), `logger-test-${Date.now()}`);
        logFile = path.join(logsDir, 'app.log');
        logger.logsDir = logsDir;
        logger.logFile = logFile;
        await fs.mkdir(logsDir, { recursive: true });
    });

    afterEach(async () => {
        try {
            await fs.rm(logsDir, { recursive: true, force: true });
        } catch (error) { 
            console.error(error);
        }
    });

    test('emits and handles "error" event', async () => {
        const failure = { message: 'Test failure' };
        const spy = jest.spyOn(logger, 'logFailure');
        logger.emit('failure', failure);
        await new Promise(r => setTimeout(r, 50));
        expect(spy).toHaveBeenCalledWith(failure);
    });
});