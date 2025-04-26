// This is a Vercel serverless function wrapper
import { createServer } from 'http';
import { app } from './dist/index.js';

// Export the Express app as a serverless function
export default function handler(req, res) {
  // Create a server from the existing app
  const server = createServer(app);
  
  // Handle the request
  server.emit('request', req, res);
} 