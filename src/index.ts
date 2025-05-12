import express from 'express';
import dotenv from 'dotenv';
import { duneDataRouter } from './routes/swapEvents';
import { refreshBuffer } from './services/bufferService';
import { initScheduler } from './services/schedulerService';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());

// Add API routes
app.use(duneDataRouter);

// Add basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, async () => {
  console.log(`Dune Buffer Service running on port ${port}`);
  
  try {
    // Initial data fetch
    console.log('Performing initial data fetch...');
    await refreshBuffer();
    console.log('Initial data fetch completed');
    
    // Initialize the scheduler
    initScheduler();
  } catch (error) {
    console.error('Failed to initialize data:', error);
  }
}); 