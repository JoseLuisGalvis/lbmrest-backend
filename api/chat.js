import OpenAI from "openai";
import { agentConfig } from "../config/agent-config.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Configurar CORS
  const allowedOrigins = [
    "http://localhost:5173",
    "https://labuenamesarestaurant.vercel.app",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Añadimos GET aquí
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    // Añadimos un mensaje simple para la interfaz en http://localhost:3000
    // Puedes personalizar el HTML o cambiarlo a JSON si prefieres
    const messageHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Backend La Buena Mesa</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f8f9fa; }
          h1 { color: #d97706; } /* Color amber-600 aproximado */
        </style>
      </head>
      <body>
        <h1>Bienvenido al Backend de La Buena Mesa</h1>
        <p>Este es el servidor API. Usa la ruta <strong>/api/chat</strong> para interactuar con el asistente virtual María.</p>
        <p>Si estás en desarrollo, el frontend está en http://localhost:5173 (o el puerto de Vite).</p>
      </body>
      </html>
    `;
    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(messageHtml);
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, sessionId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    // Construir el historial completo con el system prompt
    const fullMessages = [
      { role: "system", content: agentConfig.systemPrompt },
      ...messages,
    ];

    // Llamar a OpenAI
    const completion = await openai.chat.completions.create({
      model: agentConfig.model,
      messages: fullMessages,
      temperature: agentConfig.temperature,
      max_tokens: agentConfig.maxTokens,
    });

    const assistantMessage = completion.choices[0].message;

    return res.status(200).json({
      success: true,
      message: assistantMessage.content,
      usage: completion.usage,
      sessionId: sessionId || Date.now().toString(),
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);

    return res.status(500).json({
      success: false,
      error: "Error al procesar la solicitud",
      details: error.message,
    });
  }
}
