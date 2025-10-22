const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4130;  // Changed from 3000 to 4130 since 3000 is in use

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from public directory
app.use('/painel', express.static('painel')); // Serve painel static files

// Use this to store your NoCodeBackend API key securely in environment variables
const NOCODEBACKEND_API_KEY = process.env.NOCODEBACKEND_API_KEY;
const NOCODEBACKEND_BASE_URL = 'https://openapi.nocodebackend.com';
const INSTANCE_NAME = '41300_indie_comments_v2';

// Proxy route for NoCodeBackend API
app.use('/api/proxy', async (req, res) => {
  console.log('Proxy request:', req.method, req.url);
  console.log('Request body:', req.body);
  if (!NOCODEBACKEND_API_KEY) {
    return res.status(500).json({
      error: 'NoCodeBackend API key not configured on server. Please set NOCODEBACKEND_API_KEY in your .env file'
    });
  }

  try {
    // Construct the target URL
    const targetUrl = `${NOCODEBACKEND_BASE_URL}${req.url.replace('/api/proxy', '')}`;

    // Prepare headers for the NoCodeBackend request
    const headers = {
      'Content-Type': 'application/json',
      'Instance': INSTANCE_NAME,
      'Authorization': `Bearer ${NOCODEBACKEND_API_KEY}`, // NoCodeBackend expects API key in Bearer format
      ...req.headers
    };
  console.log('Headers sent to NoCodeBackend:', headers);

    // Remove headers that shouldn't be forwarded
    delete headers['host'];
    delete headers['content-length'];
    delete headers['origin'];
    delete headers['referer'];
    delete headers['sec-fetch-dest'];
    delete headers['sec-fetch-mode'];
    delete headers['sec-fetch-site'];
    delete headers['connection'];
    delete headers['if-none-match'];
    delete headers['priority'];

    // Forward the request to NoCodeBackend
    const proxyResponse = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });

    // Relay the response back to the frontend
    const responseText = await proxyResponse.text();

    // Set status
    res.status(proxyResponse.status);

    // Forward only safe headers (avoid problematic ones)
    const safeHeaders = ['content-type', 'content-length', 'cache-control', 'expires', 'last-modified'];
    safeHeaders.forEach(headerName => {
      const headerValue = proxyResponse.headers.get(headerName);
      if (headerValue) {
        res.set(headerName, headerValue);
      }
    });

    // Send response
    res.send(responseText);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed' });
  }
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/painel', (req, res) => {
  res.sendFile(__dirname + '/painel/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API proxy available at /api/proxy`);
});