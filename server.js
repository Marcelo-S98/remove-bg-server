import express from "express";
import multer from "multer";
import cors from "cors";
import { removeBackground } from "background-removal";

const app = express();
const upload = multer();

app.use(cors());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/remove-bg", upload.single("file"), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const inputBuffer = req.file.buffer;

    const output = await removeBackground(inputBuffer, {
      format: "png",
      model: "u2net",
      alphaMatting: false
    });

    res.set("Content-Type", "image/png");
    res.send(Buffer.from(output));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

