const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const app = express();
const cors = require("cors");
const port = 3000;

app.use(cors());
// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Handle image upload and text extraction
app.post("/your-upload-endpoint", upload.single("image"), (req, res) => {
  // Access the uploaded image in req.file.buffer

  // Use Tesseract to extract text from the image buffer
  Tesseract.recognize(
    req.file.buffer,
    "eng", // language code, e.g., 'eng' for English
    { logger: (info) => console.log(info) }
  )
    .then(({ data: { text } }) => {
      // Send the extracted text back to the client
      res.json({ text });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "Error extracting text from image" });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
