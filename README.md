# Generative Doomscrolling

An infinite scroll of AI-generated images, powered by DALL-E. Keep scrolling through an endless stream of AI-generated imagery based on your prompts.

## Features

- Infinite scroll of AI-generated images
- DALL-E integration for image generation
- Cached image support for faster loading
- Customizable image prompts
- Real-time loading states and error handling

## Project Structure

- `/frontend`: React-based web application
- `/backend`: Node.js server with DALL-E integration

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Start the server:
```bash
npm start
```

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
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. Enter a prompt in the text field (e.g., "a beautiful sunset")
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