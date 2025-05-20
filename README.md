# Generative Doomscrolling

An infinite scroll of AI-generated images, powered by DALL-E and procedural generation. The project consists of a React frontend and a Node.js/Express backend with Prisma ORM and SQLite for metadata storage.

## Features

- Infinite scroll of AI-generated and procedural images
- DALL-E integration for image generation
- Cached image support for faster loading
- Customizable image prompts
- Real-time loading states and error handling
- Metadata storage with Prisma ORM

## Project Structure

- `/frontend`: React-based web application (Vite)
- `/backend`: Node.js server with DALL-E integration, procedural generator, and Prisma ORM

## Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (for DALL-E images)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `/backend` with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://0.0.0.0:50228` by default.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000` by default.

## Backend API Endpoints

### `GET /generate-image`
- **Query Parameters:**
  - `seed` (string): Input text/prompt for image generation
  - `useAI` (boolean): Use DALL-E (true) or basic generator (false)
  - `useCache` (boolean): Return a cached image if available
- **Returns:** JSON with `imagePath`, `caption`, `prompt`, `revisedPrompt`, `createdAt` (or error JSON)
- **Note:** Always returns JSON, never a file.

### `GET /image`
- **Query Parameter:**
  - `path` (string): The path to the image file (as returned by `/generate-image`)
- **Returns:** The image file if found, otherwise 404.

### `GET /logs`
- **Returns:** The server logs in plain text.

## Usage

1. Enter a prompt in the frontend (e.g., "a beautiful sunset")
2. Toggle "Use DALL-E AI Generator" to generate new images
3. Toggle "Use Cached Images" to use previously generated images
4. Click "Generate" to start
5. Scroll down to load more images

## License
ISC License

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 