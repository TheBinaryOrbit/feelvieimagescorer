# Image Quality Analyzer API

A modular Express.js API for analyzing image quality for virtual try-on systems using Google's Generative AI.

## Project Structure

```
├── index.js                          # Main server file
├── package.json                      # Dependencies & scripts
├── .env.example                      # Environment variables template
├── src/
│   ├── config/
│   │   └── index.js                 # API configuration & model initialization
│   ├── prompts/
│   │   └── systemPrompt.js          # System prompt for image analysis
│   ├── services/
│   │   └── imageAnalyzer.js         # Core image analysis logic
│   └── routes/
│       └── analyzeRoutes.js         # Express routes & endpoints
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your Google API key to `.env`:
```
GOOGLE_API_KEY=your_api_key_here
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server runs at: `http://localhost:3000`

## API Endpoints

### 1. Analyze Image (File Upload)
**POST** `/api/analyze`

Upload an image file for quality analysis.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `image` field containing the image file

**Example with cURL:**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -F "image=@/path/to/image.jpg"
```

**Example with Fetch:**
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch('http://localhost:3000/api/analyze', {
  method: 'POST',
  body: formData
});
const result = await response.json();
```

**Response:**
```json
{
  "success": true,
  "message": "Image analyzed successfully",
  "analysis": {
    "total_score": 82,
    "status": "accepted",
    "scores": {
      "pose": 26,
      "coverage": 25,
      "face_visibility": 22,
      "brightness": 5,
      "lighting": 4
    },
    "reason": [
      "Person is standing straight",
      "Most of the full body is visible",
      "Face is clearly visible",
      "Brightness is slightly low",
      "Lighting has minor shadow issues"
    ]
  }
}
```

### 2. Analyze Image from URL
**POST** `/api/analyze-url`

Analyze an image from a URL.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body: JSON with `imageUrl` field

**Example:**
```bash
curl -X POST http://localhost:3000/api/analyze-url \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://example.com/image.jpg"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Image analyzed successfully",
  "imageUrl": "https://example.com/image.jpg",
  "analysis": {
    "total_score": 82,
    "status": "accepted",
    "scores": {...},
    "reason": [...]
  }
}
```

### 3. Health Check
**GET** `/api/health`

Check if the server is running.

**Example:**
```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{
  "success": true,
  "status": "Server is running",
  "timestamp": "2026-05-06T10:30:45.123Z"
}
```

## Supported Image Formats

- JPEG
- PNG
- WebP
- GIF

## Constraints

- Maximum file size: 5MB
- Minimum dimensions: No specific requirement (but full body should be visible)
- Face should be clearly visible
- Person should be standing straight

## Environment Variables

Create a `.env` file in the root directory:

```
GOOGLE_API_KEY=your_google_generative_ai_api_key
PORT=3000
```

## Module Breakdown

### Config Module (`src/config/index.js`)
- Initializes Google Generative AI
- Exports model instance getter
- Stores API configuration

### Prompts Module (`src/prompts/systemPrompt.js`)
- Contains the system prompt for image analysis
- Defines scoring criteria and rules
- Easy to update analysis parameters

### Services Module (`src/services/imageAnalyzer.js`)
- `analyzeImage()` - Main analysis function
- `validateImageFile()` - Validates uploaded files
- Handles API calls and error handling

### Routes Module (`src/routes/analyzeRoutes.js`)
- Defines all API endpoints
- Handles request validation
- Manages multer middleware for file uploads

## Error Handling

All endpoints return error responses in this format:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Descriptive message"
}
```

Common errors:
- `400`: Bad request (missing file, invalid format, file too large)
- `404`: Endpoint not found
- `500`: Server error

## Development Scripts

```bash
npm start       # Run production server
npm run dev     # Run development server with auto-reload
npm test        # Run tests (configure in package.json)
```

## Dependencies

- **express**: Web framework
- **multer**: File upload handling
- **@google/generative-ai**: Google Generative AI API

## License

ISC
