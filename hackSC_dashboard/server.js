import express from "express";

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('frontend'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});