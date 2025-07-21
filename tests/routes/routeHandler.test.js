const helloController = require('../../src/controllers/helloController');
const metaController = require('../../src/controllers/metaController');
const mailController = require('../../src/controllers/mailController');
const fileController = require('../../src/controllers/fileController');

const handleHelloRoutes = require('../../src/routes/helloRoutes');
const handleMetaDataRoutes = require('../../src/routes/metaRoutes');
const handleMailRoutes = require('../../src/routes/mailRoutes');
const handleFileRoutes = require('../../src/routes/fileRoutes');

jest.mock('../../src/controllers/helloController');
jest.mock('../../src/controllers/metaController');
jest.mock('../../src/controllers/mailController');
jest.mock('../../src/controllers/fileController');

describe('Route Handlers', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = { end: jest.fn(), writeHead: jest.fn() };
        jest.clearAllMocks();
    });

    test('helloRoutes calls helloController.getHello for /api/hello GET', () => {
        req.url = '/api/hello';
        req.method = 'GET';
        handleHelloRoutes(req, res);
        expect(helloController.getHello).toHaveBeenCalledWith(req, res);
    });

    test('metaRoutes calls metaController.getMetaData for /api/meta-data GET', () => {
        req.url = '/api/meta-data';
        req.method = 'GET';
        handleMetaDataRoutes(req, res);
        expect(metaController.getMetaData).toHaveBeenCalledWith(req, res);
    });

    test('mailRoutes calls mailController.sendMail for /api/mail GET', () => {
        req.url = '/api/mail';
        req.method = 'GET';
        handleMailRoutes(req, res);
        expect(mailController.sendMail).toHaveBeenCalledWith(req, res);
    });

    test('fileRoutes calls fileController.uploadFile for /api/upload POST', () => {
        req.url = '/api/upload';
        req.method = 'POST';
        handleFileRoutes(req, res);
        expect(fileController.uploadFile).toHaveBeenCalledWith(req, res);
    });

    test('fileRoutes calls fileController.downloadFile for /api/download GET', () => {
        req.url = '/api/download?file=test.pdf';
        req.method = 'GET';
        handleFileRoutes(req, res);
        expect(fileController.downloadFile).toHaveBeenCalledWith(req, res);
    });
});