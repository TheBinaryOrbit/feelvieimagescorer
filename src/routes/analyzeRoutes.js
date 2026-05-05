import express from "express";
import multer from "multer";
import { analyzeImage, validateImageFile } from "../services/imageAnalyzer.js";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

/**
 * POST /api/analyze - Analyze uploaded image
 * Expects multipart/form-data with 'image' field
 */
router.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image file provided",
        message: "Please upload an image file"
      });
    }

    // Validate file
    const validation = validateImageFile(req.file);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Analyze image
    const result = await analyzeImage(req.file.buffer, req.file.mimetype);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }

    // Return analysis result
    return res.status(200).json({
      success: true,
      message: result.message,
      analysis: result.data
    });

  } catch (error) {
    console.error("Error in analyze endpoint:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
}, (err, req, res, next) => {
  // Multer error handler
  if (err.code === 'MISSING_FIELD_NAME') {
    return res.status(400).json({
      success: false,
      error: "Invalid form data",
      message: "Please provide file with field name 'image'"
    });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: "File too large",
      message: "File size exceeds 5MB limit"
    });
  }
  next(err);
});

/**
 * POST /api/analyze-url - Analyze image from URL (optional)
 * Expects JSON body with 'imageUrl' field
 */
router.post("/analyze-url", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: "No image URL provided"
      });
    }

    // Fetch image from URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return res.status(400).json({
        success: false,
        error: "Failed to fetch image from URL"
      });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Analyze image
    const result = await analyzeImage(Buffer.from(imageBuffer), contentType);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      imageUrl: imageUrl,
      analysis: result.data
    });

  } catch (error) {
    console.error("Error in analyze-url endpoint:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
});

/**
 * GET /api/health - Health check endpoint
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Server is running",
    timestamp: new Date().toISOString()
  });
});

export default router;
