# Image Generation Server

A versatile image generation server that supports both basic geometric shapes and AI-powered DALL-E image generation.

## Features

- **Basic Image Generator**: Creates geometric shapes with random colors and positions
- **AI Image Generator**: Generates images using DALL-E 3
- **Caching System**: Stores generated images for faster retrieval
- **Flexible API**: Simple HTTP endpoints with query parameters

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your OpenAI API key:
```bash
OPENAI_API_KEY=your_api_key_here
```

4. Start the server:
```bash
node index.js
```

The server will run on `http://0.0.0.0:50228` by default.

## API Endpoints

### Generate Image
`GET /generate-image`

Query Parameters:
- `seed` (string): Input text/prompt for image generation
- `useAI` (boolean): Whether to use DALL-E (true) or basic generator (false)
- `useCache` (boolean): Whether to return a cached image if available

### View Logs
`GET /logs`

Returns the server logs in plain text format.

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

For development, the server provides detailed logging to both console and `server.log` file. 