
# Nodey

Nodey is a simple Node.js file server with endpoints for file upload/download, hello world, mail sending, and metadata retrieval. It uses only the Node.js core HTTP module (no Express) and supports logging, error handling, and modular controllers.

## Features

- File upload and download endpoints
- Hello world endpoint
- Send mail endpoint (using Nodemailer)
- Metadata endpoint (system info)
- Logging with daily log rotation
- Error handling middleware
- Modular structure (controllers, routes, middlewares, utils)

## Project Structure

```
nodey/
├── public/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── tests/
├── uploads/
├── logs/
├── server.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 16
- npm

### Install dependencies

```sh
npm install
```

### Run the server

```sh
npm run dev
# or with nodemon
npm run dev:nodemon
```

### Run tests

```sh
npm test
```

### Lint the code

```sh
npm run lint
# or to fix
npm run lint:fix
```

## API Endpoints

| Method | Endpoint           | Description           |
|--------|--------------------|-----------------------|
| GET    | /api/hello         | Hello world           |
| POST   | /api/upload        | Upload a file         |
| GET    | /api/download?file=FILENAME | Download a file |
| GET    | /api/mail          | Send a test mail      |
| GET    | /api/meta-data     | Get server metadata   |

## Environment Variables

You can set the following in a `.env` file:

- `PORT` - Port to run the server (default: 3000)

## License

ISC
