import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

let prisma = null;
export function setPrismaClient(client) {
  prisma = client;
}

export class ProceduralImageGenerator {
    generateImage(seed, seedDir) {
        const canvas = createCanvas(512, 512);
        const ctx = canvas.getContext('2d');
        const timestamp = Date.now();
        const imagePath = path.join(seedDir, `image_${timestamp}.png`);

        // Ensure the seed directory exists
        if (!fs.existsSync(seedDir)) {
            fs.mkdirSync(seedDir, { recursive: true });
        }

        // Fill background white
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, 512, 512);

        // Helper to generate random string
        function randomString(length) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }

        // Generate a caption: prompt mixed with random words
        let caption = seed;
        for (let i = 0; i < 3; i++) {
            caption += ' ' + randomString(Math.floor(Math.random() * 8 + 3));
        }

        // Draw text in a dense grid to cover the whole canvas
        const cols = 10;
        const rows = 10;
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                // Randomly choose between seed and random text
                const useSeed = Math.random() > 0.5;
                const text = useSeed ? seed : randomString(Math.floor(Math.random() * 8 + 3));
                // Randomize font size
                const fontSize = Math.floor(Math.random() * 40 + 20);
                ctx.font = `${fontSize}px sans-serif`;
                // Randomize color
                const r = Math.floor(Math.random() * 255);
                const g = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                // Calculate position with random offset
                const cellWidth = 512 / cols;
                const cellHeight = 512 / rows;
                const x = col * cellWidth + Math.random() * (cellWidth - fontSize);
                const y = row * cellHeight + Math.random() * (cellHeight - fontSize) + fontSize;
                ctx.fillText(text, x, y);
            }
        }

        // Save metadata to database (async, fire and forget)
        if (prisma) {
            prisma.image.create({
                data: {
                    imagePath,
                    caption,
                    prompt: seed,
                    revisedPrompt: null,
                    metadata: {},
                }
            }).catch(console.error);
        }

        return {
            imagePath,
            stream: canvas.createPNGStream(),
            caption
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