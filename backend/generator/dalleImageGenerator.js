import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import https from 'https';

let prisma = null;
export function setPrismaClient(client) {
  prisma = client;
}

export class DalleImageGenerator {
    constructor(apiKey, logger = console.log) {
        if (!apiKey) {
            throw new Error('OpenAI API key is required');
        }
        this.log = logger;
        this.log('Initializing DalleImageGenerator with API key:', apiKey.substring(0, 7) + '...');
        this.openai = new OpenAI({ apiKey });
    }

    async generateImage(prompt, seedDir) {
        this.log('AI Generator: Starting image generation');
        this.log('Prompt:', prompt);
        this.log('Directory:', seedDir);
        
        const timestamp = Date.now();
        const imagePath = path.join(seedDir, `image_${timestamp}.png`);

        // Ensure the seed directory exists
        if (!fs.existsSync(seedDir)) {
            this.log('AI Generator: Creating directory');
            fs.mkdirSync(seedDir, { recursive: true });
        }

        let revisedPrompt = prompt;
        try {
            this.log('AI Generator: Calling DALL-E API...');
            // Generate image using DALL-E
            const response = await this.openai.images.generate({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                response_format: "url"
            });

            this.log('AI Generator: DALL-E API Response:', JSON.stringify(response, null, 2));

            if (!response.data || response.data.length === 0) {
                throw new Error('No image data received from DALL-E');
            }

            // Extract revised_prompt if present
            if (response.data[0].revised_prompt) {
                revisedPrompt = response.data[0].revised_prompt;
            }
            if (!revisedPrompt || revisedPrompt.trim() === '') {
                revisedPrompt = prompt;
            }

            // Download the image and wait for it to complete
            await new Promise((resolve, reject) => {
                const imageUrl = response.data[0].url;
                this.log('AI Generator: Downloading image from URL:', imageUrl);
                
                const file = fs.createWriteStream(imagePath);
                let dataReceived = false;
                
                https.get(imageUrl, (response) => {
                    if (response.statusCode !== 200) {
                        file.close();
                        fs.unlink(imagePath, () => {
                            reject(new Error(`Failed to download: ${response.statusCode}`));
                        });
                        return;
                    }

                    this.log('AI Generator: Download started');
                    
                    response.pipe(file);
                    
                    response.on('data', (chunk) => {
                        dataReceived = true;
                    });

                    file.on('finish', () => {
                        if (!dataReceived) {
                            file.close();
                            fs.unlink(imagePath, () => {
                                reject(new Error('No data received during download'));
                            });
                            return;
                        }
                        file.close();
                        this.log('AI Generator: Image saved to:', imagePath);
                        // Verify the file exists and has content
                        const stats = fs.statSync(imagePath);
                        if (stats.size === 0) {
                            fs.unlink(imagePath, () => {
                                reject(new Error('Downloaded file is empty'));
                            });
                            return;
                        }
                        resolve();
                    });

                    file.on('error', (err) => {
                        file.close();
                        fs.unlink(imagePath, () => reject(err));
                    });
                }).on('error', (err) => {
                    file.close();
                    fs.unlink(imagePath, () => reject(err));
                });
            });

            // Only create the read stream after the download is complete
            this.log('AI Generator: Creating read stream for response');
            // Save metadata to database (async, fire and forget)
            if (prisma) {
                prisma.image.create({
                    data: {
                        imagePath,
                        caption: revisedPrompt,
                        prompt,
                        revisedPrompt,
                        metadata: {},
                    }
                }).catch(console.error);
            }
            return {
                imagePath,
                stream: fs.createReadStream(imagePath),
                caption: revisedPrompt,
                revisedPrompt
            };

        } catch (error) {
            this.log('AI Generator: Error:', error);
            throw error;
        }
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
                const imagePath = path.join(seedDir, randomImage);
                return imagePath;
            }
        }
        return null;
    }
} 