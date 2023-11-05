import Replicate from "replicate";
import fs from "fs/promises";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

function base64_encode(file) {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString('base64');
}

function readFileAsBuffer(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}


export async function describeImage(image, speech){
    const output = await replicate.run(
      "yorickvp/llava-13b:2facb4a474a0462c15041b78b1ad70952ea46b5ec6ad29583c0b29dbd4249591",
      {
        input: {
          image: image,
          prompt: "what is in the image?"
        }
      }
    );
    
    
    return output.join("")
}