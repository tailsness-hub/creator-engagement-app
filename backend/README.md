# Creator Engagement App - Backend

This is the backend API for the Creator Engagement App, built with Node.js and Express.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup Instructions

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your actual configuration values (Firebase credentials, API keys, etc.)

4. **Start the development server:**
   ```bash
   npm start
   ```
   
   The server will start on `http://localhost:3000` by default.

## Project Structure

```
backend/
├── api/              # API route handlers
│   └── test.js       # Test endpoint
├── config/           # Configuration files
│   └── firebase.js   # Firebase configuration (placeholder)
├── index.js          # Main server file
├── package.json      # Project dependencies and scripts
├── .env.example      # Environment variable template
└── README.md         # This file
```

## Available Endpoints

### Root
- **GET** `/` - API information and available endpoints

### Test Endpoints
- **GET** `/api/test` - Test GET request
- **POST** `/api/test` - Test POST request (echo message)

## Testing the API

You can test the API using curl or any API client like Postman:

```bash
# Test GET request
curl http://localhost:3000/api/test

# Test POST request
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello from Creator Engagement App!"}'
```

## Environment Variables

See `.env.example` for all available configuration options:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `FIREBASE_*` - Firebase configuration values

## Next Steps

1. Configure Firebase for authentication and database
2. Add social media integration endpoints
3. Implement blast off notification logic
4. Add authentication middleware
5. Set up database models for templates and user preferences

## License

ISC
