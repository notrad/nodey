const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');
const { createWriteStream, createReadStream } = require('fs');

const fileController = {
    uploadDir: path.join(__dirname, '../../uploads'),

    async init() {
        try {
            await fs.access(this.uploadDir);
        } catch {
            await fs.mkdir(this.uploadDir, { recursive: true });
        }
    },

    async uploadFile(req, res) {
        const size = parseInt(req.headers['content-length']);
        let uploadedFileSize = 0;

        if (size > this.maxFileSize) {
            res.writeHead(413, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                message: 'File too large',
                maxSize: `${this.maxFileSize / 1024 / 1024} MB`
            }));
        }

        try {
            const contentType = req.headers['content-type'];
            const boundary = contentType.split('=')[1];
            let fileName = '';

            req.once('data', async chunk => {
                const data = chunk.toString();
                const fileNameMatch = data.match(/filename="(.+?)"/);
                if (!fileNameMatch) {
                    throw new Error('No filename provided');
                }
                fileName = fileNameMatch[1];

                const filePath = path.join(this.uploadDir, fileName);
                const writeStream = createWriteStream(filePath);

                req.on('data', chunk => {
                    uploadedFileSize += chunk.length;
                    if (uploadedFileSize > this.maxFileSize) {
                        writeStream.destroy();
                        fs.unlink(filePath).catch(err => logger.emit('error', err));
                        throw new Error('File size exceeded during upload');
                    }
                });

                await new Promise((resolve, reject) => {
                    writeStream.on('finish', resolve);
                    writeStream.on('error', reject);
                    req.pipe(writeStream);
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'File uploaded successfully',
                    fileName
                }));
            });
        } catch (error) {
            logger.emit('error', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'Failed to upload file',
                error: error.message
            }));
        }
    },

    async downloadFile(req, res) {
        try {
            const fileName = path.basename(req.url.split('?')[1].split('=')[1]);
            const filePath = path.join(this.uploadDir, fileName);

            await fs.access(filePath);

            const stats = await fs.stat(filePath);

            const ext = path.extname(fileName).toLocaleLowerCase();
            const contentType = {
                '.txt': 'text/plain',
                '.pdf': 'application/pdf',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png'
            }[ext] || 'application/octet-stream';

            res.writeHead(200, {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Content-Length': stats.size
            });

            const readStream = createReadStream(filePath);
            readStream.pipe(res);
        } catch (error) {
            logger.emit('error', error);
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'File not found',
                error: error.message
            }));
        }

    }
};

fileController.init().catch(error => logger.emit('error', error));

module.exports = fileController;