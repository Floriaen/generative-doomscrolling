import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import seedrandom from 'seedrandom';

export class ImageGenerator {
    constructor() {
        this.canvas = createCanvas(512, 512);
        this.ctx = this.canvas.getContext('2d');
    }

    generateImage(seed, seedDir) {
        const timestamp = Date.now();
        const imagePath = path.join(seedDir, `image_${timestamp}.png`);

        // Ensure the seed directory exists
        if (!fs.existsSync(seedDir)) {
            fs.mkdirSync(seedDir, { recursive: true });
        }

        // Generate colored shapes based on seed
        const rng = seedrandom(seed);
        const randomFactor = Math.random();

        for (let i = 0; i < 10; i++) {
            const x = (rng() + randomFactor) * 512;
            const y = (rng() + randomFactor) * 512;
            const size = (rng() + randomFactor) * 50 + 10;
            const r = Math.floor((rng() + randomFactor) * 255);
            const g = Math.floor((rng() + randomFactor) * 255);
            const b = Math.floor((rng() + randomFactor) * 255);
            this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        return {
            imagePath,
            stream: this.canvas.createPNGStream()
        };
    }

    static getRandomCachedImage(seedDir) {
        if (fs.existsSync(seedDir)) {
            const files = fs.readdirSync(seedDir)
                .filter(file => {
                    // Filter out .DS_Store and non-image files
                    return file !== '.DS_Store' && 
                           file.toLowerCase().endsWith('.png');
                });
            
            if (files.length > 0) {
                const randomImage = files[Math.floor(Math.random() * files.length)];
                return path.join(seedDir, randomImage);
            }
        }
        return null;
    }
} 