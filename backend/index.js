import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ProceduralImageGenerator, setPrismaClient as setProceduralPrisma } from './generator/proceduralImageGenerator.js';
import { DalleImageGenerator, setPrismaClient as setDallePrisma } from './generator/dalleImageGenerator.js';
import { PrismaClient } from './generated/prisma/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set up logging to both console and file
const logFile = fs.createWriteStream('server.log', { flags: 'a' });
const log = (...args) => {
    const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
    ).join(' ');
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    // Log to console
    console.log(logMessage);
    
    // Log to file
    logFile.write(logMessage);
};

// Clear log file on startup
fs.writeFileSync('server.log', '');

// Verify API key is available
if (!process.env.OPENAI_API_KEY) {
    log('Warning: OPENAI_API_KEY not found in environment variables. AI image generation will not work.');
} else {
    log('OpenAI API Key found and loaded');
}

const app = express();
const PORT = 50228;

// Initialize generators
const aiGenerator = new DalleImageGenerator(process.env.OPENAI_API_KEY, log);
const regularGenerator = new ProceduralImageGenerator();

const prisma = new PrismaClient();
setProceduralPrisma(prisma);
setDallePrisma(prisma);

app.use(cors());

app.get('/generate-image', async (req, res) => {
    const seed = req.query.seed || '0';
    const useCache = req.query.useCache === 'true';
    const useAI = req.query.useAI === 'true';
    const seedDir = path.join(__dirname, 'cache', seed);

    log('=== New Request ===');
    log('Parameters:', {
        seed,
        useCache,
        useAI,
        seedDir
    });

    try {
        if (useCache) {
            log('Using cache mode');
            const generator = useAI ? aiGenerator : regularGenerator;
            const cachedImagePath = generator.constructor.getRandomCachedImage(seedDir);
            if (cachedImagePath) {
                log('Found cached image:', cachedImagePath);
                // Fetch metadata from DB
                const imageRecord = await prisma.image.findFirst({ where: { imagePath: cachedImagePath } });
                if (imageRecord) {
                    return res.json({
                        imagePath: cachedImagePath,
                        caption: imageRecord.caption,
                        prompt: imageRecord.prompt,
                        revisedPrompt: imageRecord.revisedPrompt,
                        createdAt: imageRecord.createdAt
                    });
                } else {
                    // fallback: return minimal JSON
                    return res.json({
                        imagePath: cachedImagePath,
                        caption: '',
                        prompt: '',
                        revisedPrompt: '',
                        createdAt: ''
                    });
                }
            }
            log('No cached image found');
            return res.status(404).json({ error: 'Image not found' });
        }

        if (useAI) {
            log('=== Using AI Generator ===');
            if (!process.env.OPENAI_API_KEY) {
                log('Error: OpenAI API key not configured');
                return res.status(500).send('OpenAI API key not configured');
            }
            try {
                log('Starting AI image generation...');
                const { imagePath, stream, caption } = await aiGenerator.generateImage(seed, seedDir);
                log('AI image generated successfully at:', imagePath);
                res.json({
                    imagePath,
                    caption,
                    prompt: seed,
                    revisedPrompt: caption,
                    createdAt: new Date().toISOString()
                });
            } catch (error) {
                log('Error in AI generation:', error);
                res.status(500).send('Error generating image: ' + error.message);
            }
        } else {
            log('=== Using Regular Generator ===');
            const { imagePath, stream, caption } = regularGenerator.generateImage(seed, seedDir);
            const out = fs.createWriteStream(imagePath);
            stream.pipe(out);
            out.on('finish', async () => {
                log('Regular image generated successfully');
                res.json({
                    imagePath,
                    caption,
                    prompt: seed,
                    revisedPrompt: null,
                    createdAt: new Date().toISOString()
                });
            });
        }
    } catch (error) {
        log('Error in route handler:', error);
        res.status(500).send('Error generating image: ' + error.message);
    }
});

// Add a route to view logs
app.get('/logs', (req, res) => {
    try {
        const logs = fs.readFileSync('server.log', 'utf8');
        res.type('text/plain').send(logs);
    } catch (error) {
        res.status(500).send('Error reading logs');
    }
});

app.get('/image', (req, res) => {
  const imagePath = req.query.path;
  if (!imagePath) return res.status(400).send('No image path provided');
  res.sendFile(imagePath, err => {
    if (err) res.status(404).send('Image not found');
  });
});

app.listen(PORT, '0.0.0.0', () => {
    log('===========================================');
    log(`Server is running on http://0.0.0.0:${PORT}`);
    log('===========================================');
});