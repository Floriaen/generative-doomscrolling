import express from 'express';
import cors from 'cors';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import seedrandom from 'seedrandom';

const app = express();
const PORT = 50228;

app.use(cors());

app.get('/generate-image', (req, res) => {
    const seed = req.query.seed || '0';
    const seedDir = path.join(__dirname, 'cache', seed);
    const imagePath = path.join(seedDir, 'image.png');

    // Check if the image already exists
    if (fs.existsSync(imagePath)) {
        return res.sendFile(imagePath);
    }

    // Create directory for the seed if it doesn't exist
    if (!fs.existsSync(seedDir)) {
        fs.mkdirSync(seedDir, { recursive: true });
    }
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');

    // Generate colored shapes based on seed
    const rng = seedrandom(seed);
const randomFactor = Math.random() + Date.now();


    for (let i = 0; i < 10; i++) {
        const x = (rng() + randomFactor) * 512;
        const y = (rng() + randomFactor) * 512;
        const size = (rng() + randomFactor) * 50 + 10;
        const r = Math.floor((rng() + randomFactor) * 255);
        const g = Math.floor((rng() + randomFactor) * 255);
        const b = Math.floor((rng() + randomFactor) * 255);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    res.setHeader('Content-Type', 'image/png');
    const out = fs.createWriteStream(imagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => res.sendFile(imagePath));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});