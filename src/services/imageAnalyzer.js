import { getModel } from "../config/index.js";
import { SYSTEM_PROMPT } from "../prompts/systemPrompt.js";

/**
 * Analyze image quality for virtual try-on
 * @param {Buffer} imageBuffer - The image file buffer
 * @param {string} mimeType - The MIME type of the image (e.g., 'image/jpeg')
 * @returns {Promise<Object>} Analysis result with score and status
 */
export const analyzeImage = async (imageBuffer, mimeType = "image/jpeg") => {
  try {
    const model = getModel();
    
    const result = await model.generateContent([
      SYSTEM_PROMPT,
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: mimeType,
        },
      },
      "Analyze this image according to the criteria and provide the JSON response."
    ]);

    const responseText = result.response.text();
    
    // Parse JSON response
    const analysisResult = JSON.parse(responseText);
    
    return {
      success: true,
      data: analysisResult,
      message: "Image analyzed successfully"
    };
  } catch (error) {
    console.error("Image analysis error:", error);
    
    return {
      success: false,
      error: error.message,
      message: "Failed to analyze image"
    };
  }
};

/**
 * Validate image file
 * @param {Object} file - Multer file object
 * @returns {Object} Validation result
 */
export const validateImageFile = (file) => {
  if (!file) {
    return {
      valid: false,
      error: "No file provided"
    };
  }

  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  
  if (!allowedMimes.includes(file.mimetype)) {
    return {
      valid: false,
      error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF"
    };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size exceeds 5MB limit"
    };
  }

  return {
    valid: true
  };
};
