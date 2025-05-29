const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class Logger extends EventEmitter {
    constructor() {
        super();

        this.logsDir = path.join(__dirname, '../../logs');
        this.logFile = null;
        this.init();

        this.on('error', (error) => this.logError(error));
        this.on('failure', (failure) => this.logFailure(failure));
    }

    init() {
        if (!fs.existsSync(this.logsDir)) {
            fs.mkdirSync(this.logsDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g,'-');
        this.logFile = path.join(this.logsDir, `session-${timestamp}.log`);
    }

    logError(error) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ERROR: ${error.message}\n${error.message}\n`;

        fs.appendFileSync(this.logFile, logEntry);
        console.log(`Error: ${error.message}`);
    }

    logFailure(failure) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] FAILURE: ${JSON.stringify(failure)}\n`;
        
        fs.appendFileSync(this.logFile, logEntry);
        console.warn(`Failure: ${JSON.stringify(failure)}`);
    }
}

module.exports = new Logger();