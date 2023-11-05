import fs from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "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" // This is also the default, can be omitted
});


export async function transcribe() {
    console.log("transcribing text");
    const response = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: fs.createReadStream('audio_uploads/audio.mp3'),
      });
  
    console.log("transcribing done");
    console.log(response);
    return response;
  }