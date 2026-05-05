import express from "express";
import analyzeRoutes from "./src/routes/analyzeRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", analyzeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    availableEndpoints: {
      "POST /api/analyze": "Upload image and get quality analysis",
      "POST /api/analyze-url": "Analyze image from URL",
      "GET /api/health": "Health check"
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  // Handle Multer errors
  if (err.code === 'MISSING_FIELD_NAME' || err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: "Invalid request",
      message: "Please check your request format and try again"
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    error: "Internal server error",
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✨ Server running at http://localhost:${PORT}`);
  console.log(`📸 Upload endpoint: POST http://localhost:${PORT}/api/analyze`);
  console.log(`🔗 URL endpoint: POST http://localhost:${PORT}/api/analyze-url`);
  console.log(`💚 Health check: GET http://localhost:${PORT}/api/health`);
});

export default app;
