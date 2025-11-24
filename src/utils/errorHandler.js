export function errorHandler(res, error) {
  console.error("🔥 Error:", error);
  return res.status(500).json({
    success: false,
    error: "Error interno del servidor",
    details: error.message,
  });
}
