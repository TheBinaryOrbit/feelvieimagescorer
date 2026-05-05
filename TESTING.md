# API Testing Examples

## 1. Test Image Analysis (File Upload)

### Using cURL
```bash
# Single file upload
curl -X POST http://localhost:3000/api/analyze \
  -F "image=@path/to/your/image.jpg"

# Example with actual path
curl -X POST http://localhost:3000/api/analyze \
  -F "image=@11.png"
```

### Using Postman
1. Set request to POST
2. URL: `http://localhost:3000/api/analyze`
3. Go to Body tab
4. Select "form-data"
5. Add key: `image` (type: File)
6. Select your image file
7. Click Send

### Using JavaScript Fetch
```javascript
const fileInput = document.getElementById('imageInput'); // HTML file input
const file = fileInput.files[0];

const formData = new FormData();
formData.append('image', file);

const response = await fetch('http://localhost:3000/api/analyze', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result);
```

### Using Python Requests
```python
import requests

with open('image.jpg', 'rb') as f:
    files = {'image': f}
    response = requests.post('http://localhost:3000/api/analyze', files=files)
    print(response.json())
```

---

## 2. Test Image Analysis from URL

### Using cURL
```bash
curl -X POST http://localhost:3000/api/analyze-url \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://example.com/image.jpg"}'
```

### Using Postman
1. Set request to POST
2. URL: `http://localhost:3000/api/analyze-url`
3. Go to Body tab
4. Select "raw" and choose "JSON"
5. Paste:
```json
{
  "imageUrl": "https://example.com/image.jpg"
}
```
6. Click Send

### Using JavaScript Fetch
```javascript
const response = await fetch('http://localhost:3000/api/analyze-url', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    imageUrl: 'https://example.com/image.jpg'
  })
});

const result = await response.json();
console.log(result);
```

---

## 3. Health Check

### Using cURL
```bash
curl http://localhost:3000/api/health
```

### Using Browser
Simply visit: `http://localhost:3000/api/health`

### Using JavaScript Fetch
```javascript
const response = await fetch('http://localhost:3000/api/health');
const result = await response.json();
console.log(result);
```

---

## Response Examples

### Success Response
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

### Error Response
```json
{
  "success": false,
  "error": "Invalid file type. Allowed: JPEG, PNG, WebP, GIF"
}
```

---

## Testing Script (Node.js)

Create `test-api.js`:

```javascript
import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';

async function testAPI() {
  // Test 1: Health Check
  console.log('Testing health check...');
  const healthRes = await fetch('http://localhost:3000/api/health');
  console.log('Health:', await healthRes.json());

  // Test 2: File Upload
  console.log('\nTesting file upload...');
  const formData = new FormData();
  formData.append('image', fs.createReadStream('11.png'));
  
  const uploadRes = await fetch('http://localhost:3000/api/analyze', {
    method: 'POST',
    body: formData
  });
  console.log('Upload result:', await uploadRes.json());

  // Test 3: URL Analysis
  console.log('\nTesting URL analysis...');
  const urlRes = await fetch('http://localhost:3000/api/analyze-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageUrl: 'https://example.com/sample.jpg'
    })
  });
  console.log('URL result:', await urlRes.json());
}

testAPI().catch(console.error);
```

Run with: `node test-api.js`
