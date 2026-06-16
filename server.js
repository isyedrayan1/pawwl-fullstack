// Hostinger Entry Point (Phusion Passenger)
// Passenger requires the entry file to export the Express app.
// It handles port binding and process management internally.
import app from './backend/dist/src/server.js';
export default app;
