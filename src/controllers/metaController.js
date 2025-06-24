const logger = require('../utils/logger');

const metaController = {
    getMetaData: async (req, res) => {
        try {
            const metaData = {
                nodeVersion: process.version,
                platform: process.platform,
                arch: process.arch,
                memoryUsage: process.memoryUsage(),
                cpuUsage: process.cpuUsage(),
                uptime: process.uptime(),
                pid: process.pid,
                cwd: process.cwd(),
                env: process.env.NODE_ENV || 'dev',
                title: process.title
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(metaData));
        } catch (error) {
            await logger.emit('error', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'Internal server error',
                status: 'error'
            }));
        }
    }
};

module.exports = metaController;