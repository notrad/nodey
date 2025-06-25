const helloController = require('../src/controllers/helloController');

describe('helloController', () => {
    it('Should respond with a hello message', async () => {
        const req = {};
        let statusCode, headers, body;
        const res = {
            writeHead: (code, hdrs) => {
                statusCode = code;
                headers = hdrs;
            },
            end: (data) => {
                body = data;
            }
        };

        await helloController.getHello(req, res);

        expect(statusCode).toBe(200);
        expect(headers['Content-Type']).toBe('application/json');
        expect(JSON.parse(body)).toEqual({
            message: 'Hello, there!',
            status: 'success'
        });
    });
});