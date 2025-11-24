import { openaiService } from "../services/openaiService.js";

export async function chatController(req, res) {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://labuenamesarestaurant.vercel.app",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { messages, sessionId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages[] requerido" });
    }

    const response = await openaiService(messages, sessionId);

    return res.status(200).json(response);
  } catch (err) {
    console.error("Error chatController:", err);

    return res.status(500).json({
      success: false,
      error: "Error al procesar la solicitud",
      details: err.message,
    });
  }
}
