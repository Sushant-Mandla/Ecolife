# SUSTAIN

SUSTAIN is a sustainability-focused web app built with a Vite + React frontend and a Node.js + Express backend. It includes eco-living content, a chatbot, community chat, green home tools, energy conservation helpers, gardening guidance, zero-waste utilities, and transport-related features.

## Features

- EcoBot AI assistant for sustainability Q&A and guidance
- Real-time chat with message reactions and file/audio attachments
- Green Home score and energy saving tools
- Urban gardening recommendations and crop suggestions
- Zero-waste helpers and sustainability tracking widgets
- Sustainable transport content and route/map-related UI
- News feed for sustainability-related articles

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Socket.IO client, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO
- AI and external services: OpenRouter/OpenAI-compatible APIs, News API, email delivery via Nodemailer

## Project Structure

- [client](client) - React application
- [server](server) - API, sockets, database models, and AI integrations

## Prerequisites

- Node.js 18+ recommended
- npm
- MongoDB database, either local or MongoDB Atlas

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd SUSTAIN
```

### 2. Install dependencies

Install the frontend dependencies:

```bash
cd client
npm install
```

Install the backend dependencies:

```bash
cd ../server
npm install
```

## Environment Variables

Create a [server/.env](server/.env) file with the values your app needs.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NEWS_API_KEY=your_news_api_key

# AI features
OPENROUTER_API_KEY=your_openrouter_key
# or
OPENAI_API_KEY=your_openai_key
OPENROUTER_SITE_URL=http://localhost:5173
OPENROUTER_APP_NAME=SUSTAIN

# Email features
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

Notes:

- `MONGO_URI` is required for the database connection.
- `JWT_SECRET` is required for authentication.
- `NEWS_API_KEY` is required for the news feature.
- `OPENROUTER_API_KEY` or `OPENAI_API_KEY` is required for EcoBot and gardening AI features.
- Email variables are only needed if you use the subscription/email features.

## Running the App

Open two terminals.

### Terminal 1: Start the backend

```bash
cd server
node index.js
```

The backend runs on port `5000`.

### Terminal 2: Start the frontend

```bash
cd client
npm run dev
```

The frontend runs on port `5173` by default.

## Build

To build the frontend for production:

```bash
cd client
npm run build
```

To preview the production build locally:

```bash
cd client
npm run preview
```

## Data and Storage Notes

- Chat messages are stored in MongoDB.
- Chat uploads are stored in MongoDB GridFS and served through the backend.
- There is no need to keep a local `uploads` folder in the project.

## Troubleshooting

- If the backend fails to start, check that your MongoDB URI and secrets are set correctly in [server/.env](server/.env).
- If the frontend cannot reach the backend, confirm the backend is running on `http://localhost:5000`.
- If AI requests fail, verify the OpenRouter/OpenAI key and the external API account status.

## License

No license has been specified yet.