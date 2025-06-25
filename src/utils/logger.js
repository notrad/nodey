const EventEmitter = require('events');
const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');

cron.schedule('0 0 * * *', async () => {
    const logsDir = path.join(__dirname, '../../logs');
    try {
        const files = await fs.readdir(logsDir);
        for (const file of files) {
            if (file.endsWith('.log')){
                await fs.unlink(path.join(logsDir, file));
            }
        }
    } catch (error) {
        console.error('Error clearing log files:', error);
    }
});

class Logger extends EventEmitter {
    constructor() {
        super();

        this.logsDir = path.join(__dirname, '../../logs');
        this.logFile = null;
        this.ready = this.init();

        this.on('error', (error) => this.logError(error));
        this.on('failure', (failure) => this.logFailure(failure));
        this.on('info', (info) => this.logInfo(info));
    }

    async init() {
        try {
            try {
                await fs.access(this.logsDir);
            } catch {
                await fs.mkdir(this.logsDir, { recursive: true });
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            this.logFile = path.join(this.logsDir, `session-${timestamp}.log`);
        } catch (error) {
            console.error('Failed to initialize logger:', error);
            throw error;
        }
    }

    async logError(error) {
        try {
            await this.ready;
            const timestamp = new Date().toISOString();
            const logEntry = `[${timestamp}] ERROR: ${error.message}\n${error.stack}\n`;

            await fs.appendFile(this.logFile, logEntry);
            console.error(`Error: ${error.message}`);
        } catch (error) {
            console.error('Failed to log error:', error);
        }
    }

    async logFailure(failure) {
        try {
            await this.ready;
            const timestamp = new Date().toISOString();
            const logEntry = `[${timestamp}] FAILURE: ${JSON.stringify(failure)}\n`;

            await fs.appendFile(this.logFile, logEntry);
            console.warn(`Failure: ${JSON.stringify(failure)}`);
        } catch (error) {
            console.error('Failed to log failure:', error);
        }
    }

    async logInfo(info) {
        try {
            await this.ready;
            const timestamp = new Date().toISOString();
            const logEntry = `[${timestamp}] INFO: ${JSON.stringify(info)}\n`;

            await fs.appendFile(this.logFile, logEntry);
            console.info(`INFO: ${JSON.stringify(info)}`);
        } catch (error) {
            console.error('Failed to log info:', error);
        }
    }
}

module.exports = new Logger();