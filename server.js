import express from "express";
import cors from "cors";
import multer from "multer";
import { removeBackground } from "@imgly/background-removal-node";

const app = express();
const upload = multer();

// CORS básico
app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Rota principal para remover fundo
app.post("/remove-bg", upload.single("image"), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "Nenhuma imagem enviada" });
    }

    // Cria um Blob a partir do buffer recebido
    const imageBlob = new Blob([req.file.buffer]);

    // removeBackground retorna um Blob com o PNG já recortado
    const resultBlob = await removeBackground(imageBlob, {
      // você pode passar opções aqui (modelo 'medium', etc) se quiser
      // model: "medium"
    });

    // Converte Blob → Buffer para enviar na resposta HTTP
    const arrayBuffer = await resultBlob.arrayBuffer();
    const outputBuffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "image/png");
    res.send(outputBuffer);
  } catch (error) {
    console.error("Erro ao remover fundo:", error);
    res.status(500).json({ error: "Erro ao processar a imagem" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
