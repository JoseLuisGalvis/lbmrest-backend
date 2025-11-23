import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import handler from "../api/chat.js";

// Cargar variables de entorno
dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get("/", (req, res) => {
  const apiKeyStatus = process.env.OPENAI_API_KEY
    ? "✅ Configurada"
    : "❌ NO configurada";

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Backend La Buena Mesa</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 { 
          color: #d97706; 
          margin: 0 0 10px 0;
          font-size: 2.5em;
        }
        .subtitle {
          color: #64748b;
          margin: 0 0 30px 0;
          font-size: 1.1em;
        }
        .status-card {
          background: #f8fafc;
          border-left: 4px solid #d97706;
          padding: 20px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .status-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .status-item:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: 600;
          color: #475569;
        }
        .value {
          color: #0f172a;
        }
        .endpoint {
          background: #1e293b;
          color: #64748b;
          padding: 15px;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          margin: 20px 0;
        }
        .endpoint-url {
          color: #22d3ee;
        }
        .footer {
          text-align: center;
          color: #94a3b8;
          margin-top: 30px;
          font-size: 0.9em;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🍽️ La Buena Mesa</h1>
        <p class="subtitle">API del Agente de Atención al Cliente</p>
        
        <div class="status-card">
          <div class="status-item">
            <span class="label">Estado del Servidor:</span>
            <span class="value">✅ En línea</span>
          </div>
          <div class="status-item">
            <span class="label">Puerto:</span>
            <span class="value">${PORT}</span>
          </div>
          <div class="status-item">
            <span class="label">OpenAI API Key:</span>
            <span class="value">${apiKeyStatus}</span>
          </div>
          <div class="status-item">
            <span class="label">Modo:</span>
            <span class="value">Desarrollo (Express)</span>
          </div>
        </div>

        <h3>📡 Endpoint Disponible:</h3>
        <div class="endpoint">
          POST <span class="endpoint-url">http://localhost:${PORT}/api/chat</span>
        </div>

        <div class="footer">
          <p>Servidor de desarrollo • Express + Node.js</p>
          <p>Para producción, usa: <strong>vercel --prod</strong></p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Endpoint del chat - wrapper para el handler de Vercel
app.all("/api/chat", async (req, res) => {
  console.log(`📨 ${req.method} /api/chat`);
  await handler(req, res);
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint no encontrado",
    availableEndpoints: ["/api/chat"],
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log("🍽️  LA BUENA MESA - Backend de Desarrollo");
  console.log("=".repeat(60));
  console.log(`✅ Servidor Express corriendo en: http://localhost:${PORT}`);
  console.log(`📡 Endpoint del chat: http://localhost:${PORT}/api/chat`);
  console.log(
    `🔑 OpenAI API Key: ${
      process.env.OPENAI_API_KEY ? "✓ CONFIGURADA" : "✗ NO CONFIGURADA"
    }`
  );
  console.log("=".repeat(60) + "\n");

  if (!process.env.OPENAI_API_KEY) {
    console.warn("⚠️  ADVERTENCIA: OpenAI API Key no configurada");
    console.warn("   Crea un archivo .env.local con: OPENAI_API_KEY=tu-key\n");
  }
});
