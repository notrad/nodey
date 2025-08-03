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

    test('emit and handles "failures" event', async () => {
        const error = new Error('Test error');
        const spy = jest.spyOn(logger, 'logError');
        logger.emit('error', error);
        await new Promise(r => setTimeout(r, 50));
        expect(spy).toHaveBeenCalledWith(error);
    });

    test('emits and handles "info" event', async () => {
        const info = { message: 'Tent info' };
        const spy = jest.spyOn(logger, 'logInfo');
        logger.emit('info', info);
        await new Promise(r => setTimeout(r, 50));
        expect(spy).toHaveBeenCalledWith(info);
    });

    test('creates log file and writes error log', async () => {
        const error = new Error('File creation test');
        await logger.logError(error);
        const content = await fs.readFile(logFile, 'utf8');
        expect(content).toMatch(/ERROR/);
        expect(content).toMatch(/File creation test/);
    });

    test('write failure and info logs', async () => {
        await logger.logFailure({ message: 'Failure log' });
        await logger.logInfo({ message: 'Info log' });
        const content = await fs.readFile(logFile, 'utf8');
        expect(content).toMatch(/Failure/);
        expect(content).toMatch(/Failure log/);
        expect(content).toMatch(/Info/);
        expect(content).toMatch(/Info log/);
    });
});