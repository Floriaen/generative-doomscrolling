# Backend: Image Generation Server

A versatile image generation server that supports both basic geometric shapes and AI-powered DALL-E image generation, with metadata stored in SQLite via Prisma ORM.

## Features

- **Basic Image Generator**: Creates geometric shapes with random colors and positions
- **AI Image Generator**: Generates images using DALL-E 3
- **Caching System**: Stores generated images for faster retrieval
- **Flexible API**: Simple HTTP endpoints with query parameters
- **Metadata Storage**: Stores metadata in SQLite via Prisma ORM

## Setup

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

## Prisma & Database
- Prisma schema and migrations are in `/backend/prisma/`
- SQLite database is used for development by default

## API Endpoints

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

## Usage Examples

### Generate Basic Geometric Image
```bash
curl "http://localhost:50228/generate-image?seed=test&useAI=false" --output basic.png
```

### Generate AI Image with DALL-E
```bash
curl "http://localhost:50228/generate-image?seed=a%20beautiful%20sunset&useAI=true" --output ai.png
```

### Get Cached Image
```bash
curl "http://localhost:50228/generate-image?seed=a%20beautiful%20sunset&useAI=true&useCache=true" --output cached.png
```

### View Server Logs
```bash
curl "http://localhost:50228/logs"
```

## Error Handling

The server includes comprehensive error handling:
- Validates OpenAI API key availability
- Checks for successful image downloads
- Verifies file integrity
- Handles invalid requests gracefully

## Caching

Generated images are cached in the `cache/` directory, organized by seed value. The caching system:
- Automatically creates cache directories
- Stores images with timestamp-based filenames
- Supports random selection from cached images
- Filters out system files (.DS_Store, etc.)

## Development

The server is built with:
- Node.js
- Express.js
- OpenAI API (DALL-E 3)
- Canvas for basic image generation
- Prisma ORM with SQLite

For development, the server provides detailed logging to both console and `server.log` file. 