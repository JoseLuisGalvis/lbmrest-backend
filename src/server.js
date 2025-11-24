import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta raíz
app.get("/", (req, res) => {
  res.send(`
    <h1>🍽️ La Buena Mesa - Backend María</h1>
    <p>Servidor Express funcionando correctamente.</p>
    <p>Endpoint: <strong>/api/chat</strong></p>
  `);
});

// Rutas del chat
app.use("/api/chat", chatRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Init server
app.listen(PORT, () => {
  console.log(`🔥 Servidor activo en http://localhost:${PORT}`);
});
