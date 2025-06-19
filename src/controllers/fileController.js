const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');
const { createWriteStream, createReadStream } = require('fs');
const Busboy = require('busboy');

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
        try {
            const busboy = Busboy({ headers: req.headers });
            let uploadPromise = null;

            busboy.on('file', (fieldname, file, fileInfo) => {
                const { filename } = fileInfo;
                const filePath = path.join(this.uploadDir, filename);
                const writeStream = createWriteStream(filePath);

                uploadPromise = new Promise((resolve, reject) => {
                    file.pipe(writeStream);
                    writeStream.on('finish', () => resolve(filename));
                    writeStream.on('error', reject);
                });
            });

            busboy.on('finish', async () => {
                try {
                    const filename = await uploadPromise;
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        message: 'File uploaded successfully',
                        filename
                    }));
                } catch (error) {
                    logger.emit('error', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        message: 'Upload failed',
                        error: error.message
                    }));
                }
            });

            req.pipe(busboy);
        } catch (error) {
            logger.emit('error', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'Failed to process upload',
                error: error.message
            }));
        }
    },

    async downloadFile(req, res) {
        try {
            const fileName = decodeURIComponent(
                path.basename(req.url.split('?')[1].split('=')[1])
            );
            const filePath = path.join(this.uploadDir, fileName);

            await fs.access(filePath);
            const stats = await fs.stat(filePath);

            const ext = path.extname(fileName).toLocaleLowerCase();
            const contentType = {
                '.txt': 'text/plain',
                '.pdf': 'application/pdf',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.doc': 'application/msword',
                '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            }[ext] || 'application/octet-stream';

            res.writeHead(200, {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
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