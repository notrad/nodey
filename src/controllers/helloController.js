const helloController = {
    getHello: (req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Hello, there!',
            status: 'success'
        }));
    }
};

module.exports = helloController;