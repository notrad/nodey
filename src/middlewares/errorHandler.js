const errorHandler = {
    notFound: (res) => {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Route not found',
            status: 'error'
        }));
    },

    methodNotAllowed: (res) => {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Method not allowed',
            status: 'error'
        }));
    }
};

module.exports = errorHandler;