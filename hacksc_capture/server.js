import express from 'express'
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import formidable, {errors as formidableErrors} from 'formidable';
import ffmpeg from 'fluent-ffmpeg';

import {describeImage} from './ai.js';
import {transcribe} from './transcription.js'

const app = express();

app.use(cors());

app.use(express.json({ limit: '50mb' }));

async function downloadImage(imageDataUrl) {
    // Remove the header of the data URL and parse the base64 content
    const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
    
    // Convert the base64 string to a Buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate a filename (you could also send this from the client, or generate a unique ID here)
    const filename = 'image-' + Date.now() + '.png'; // Use a timestamp for a unique filename
    
    // Create a path where the image will be saved
    const savePath = path.join('./uploads', filename);
  
    try {
      // Write the Buffer to a file
      fs.writeFileSync(savePath, buffer);
  
      console.log(`Image saved as ${filename}`);
      // You can now respond to the client that the upload was successful
      // res.send({ status: 'success', message: `Image saved as ${filename}` });
    } catch (error) {
      console.error('Failed to save the image:', error);
      // If there's an error, you can send an error response back to the client
      // res.status(500).send({ status: 'error', message: 'Failed to save the image' });
    }
  }

const convertToMP3 = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
        .toFormat('mp3')
        .on('error', (err) => {
        console.error('An error occurred: ' + err.message);
        fs.unlink(inputPath, (unlinkErr) => {
            if (unlinkErr) console.error('An error occurred while trying to delete the original file:', unlinkErr);
            reject(err);
        });
        })
        .on('end', () => {
        console.log('Processing finished!');
        fs.unlink(inputPath, (unlinkErr) => {
            if (unlinkErr) {
            console.error('An error occurred while trying to delete the original file:', unlinkErr);
            reject(unlinkErr);
            } else {
            console.log("saved as", outputPath);
            resolve(outputPath);
            }
        });
        })
        .save(outputPath); // This will save the converted MP3 file
    });
};

const handleAudioUpload = (req, res) => {
    const form = formidable({});
    form.uploadDir = path.join('./audio_uploads');
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
        console.error('Error parsing the files:', err);
        return res.status(500).send('An error occurred during the upload');
        }

        if (!files.audio) {
        return res.status(400).send('No audio file was uploaded.');
        }
    
        const oldPath = files.audio[0]?.filepath;
        const newFilePath = path.join(form.uploadDir, `${Date.now()}.mp3`);

        // Wait for the MP3 conversion to complete
        await convertToMP3(oldPath, "./audio_uploads/audio.mp3");
    

    });
};

app.post('/upload', async (req, res) => {
  const { imageUrl } = req.body.image; // The frontend should send the image URL in the body

  downloadImage(req.body.image);
  const description = await describeImage(req.body.image);
  console.log(description)
});

app.post('/upload_audio', async (req, res) => {
    await handleAudioUpload(req, res);
    // Once conversion is done, proceed with transcription
    const transcription = await transcribe();
    console.log("transcription", transcription.text);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
