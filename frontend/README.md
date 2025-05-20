# Frontend: Generative Doomscrolling

A React + Vite web app for infinite scrolling of AI-generated and procedural images, powered by a Node.js/Express backend.

## Features
- Infinite scroll feed of images
- Captions and metadata for each image
- Loading spinners and error handling
- Fetches images and metadata from backend API

## Setup

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
   The app will be available at `http://localhost:3000` by default.

## How it Works
- The frontend fetches image metadata from the backend `/generate-image` endpoint.
- Images are displayed using the `/image` endpoint with the returned `imagePath`.
- Captions and prompts are shown below each image.
- Infinite scroll loads more images as you scroll down.

## Backend Dependency
- Requires the backend server to be running (see root or backend README for setup).

## Customization
- You can change prompts, toggle DALL-E/procedural generation, and use cached images from the UI.
