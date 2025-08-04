const http = require('http');
const server = require('../server');

describe('server.js', () => {
    let app;
    let listener;

    beforeAll(done => {
        app = http.createServer(server);
        listener = app.listen(10000, done);
    });

    afterAll(done => {
        listener.close(done);
    });

    test('should set CORS headers', async () => {
        const res = await new Promise(resolve => {
            const req = http.request(
                { method: 'OPTIONS', port: 3000, path: '/' },
                resolve
            );
            req.end();
        });
        expect(res.headers['access-control-allow-origin']).toBe('*');
        expect(res.headers['access-control-allow-methods']).toContain('GET');
        expect(res.headers['access-control-allow-methods']).toContain('POST');
    });

    test('should handle GET and POST routes', async () => {
        const res = await new Promise(resolve => {
            const req = http.request(
                { method: 'GET', port: 3000, path: '/' },
                resolve
            );
            req.end();
        });
        expect([200, 404]).toContain(res.statusCode);
    });

    test('should return 404 for unknown route', async () => {
        const res = await new Promise(resolve => {
            const req = http.request(
                { method: 'GET', port: 3000, path: '/unknown' },
                resolve
            );
            req.end();
        });
        expect(res.statusCode).toBe(404);
    });

    test('should return 405 for unsupported HTTP methods', async () => {
        const res = await new Promise(resolve => {
            const req = http.request(
                { method: 'PUT', port: 3000, path: '/' },
                resolve
            );
            req.end();
        });
        expect(res.statusCode).toBe(405);
    });
});