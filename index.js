import express from "express";
import cors from "cors";
import analyzeRoutes from "./src/routes/analyzeRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Comprehensive logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Log incoming request
  console.log("\n📥 INCOMING REQUEST");
  console.log("━".repeat(50));
  console.log(`🔹 Method: ${req.method}`);
  console.log(`🔹 URL: ${req.url}`);
  console.log(`🔹 IP: ${req.ip}`);
  console.log(`🔹 Headers:`, JSON.stringify(req.headers, null, 2));
  if (Object.keys(req.body).length > 0) {
    console.log(`🔹 Body:`, JSON.stringify(req.body, null, 2));
  }
  if (Object.keys(req.query).length > 0) {
    console.log(`🔹 Query:`, JSON.stringify(req.query, null, 2));
  }
  console.log("━".repeat(50));
  
  // Intercept response to log it
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    console.log("\n📤 OUTGOING RESPONSE");
    console.log("━".repeat(50));
    console.log(`🔹 Status: ${res.statusCode}`);
    console.log(`🔹 Duration: ${duration}ms`);
    console.log(`🔹 Headers:`, JSON.stringify(res.getHeaders(), null, 2));
    console.log(`🔹 Body:`, typeof data === "string" ? data : JSON.stringify(data, null, 2));
    console.log("━".repeat(50) + "\n");
    
    return originalSend.call(this, data);
  };
  
  next();
});

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
