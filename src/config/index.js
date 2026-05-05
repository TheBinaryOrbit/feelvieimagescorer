import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
const API_KEY = process.env.GOOGLE_API_KEY;
const MODEL_NAME = process.env.MODEL_NAME;

// Initialize Generative AI
const genAI = new GoogleGenerativeAI(API_KEY);

// Get model instance
const getModel = () => {
  return genAI.getGenerativeModel({ model: MODEL_NAME });
};

export { getModel, API_KEY, MODEL_NAME };
