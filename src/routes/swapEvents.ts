import { Router, Request, Response } from 'express';
import { getBufferedDuneData, refreshBuffer } from '../services/bufferService';

export const duneDataRouter = Router();

/**
 * GET /dune-data
 * Returns all buffered Dune data as a single JSON
 */
duneDataRouter.get('/dune-data', (req: Request, res: Response) => {
  try {
    const data = getBufferedDuneData();
    
    if (!data) {
      return res.status(404).json({ 
        error: 'No buffered data available',
        message: 'The buffer has not been populated yet. Try again later.'
      });
    }
    
    return res.json(data);
  } catch (error) {
    console.error('Error retrieving Dune data:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to retrieve Dune data'
    });
  }
});

/**
 * POST /refresh
 * Manually triggers a refresh of the Dune data buffer
 * Protected by API key for security
 */
duneDataRouter.post('/refresh', async (req: Request, res: Response) => {
  // This could be enhanced with proper authentication
  const apiKey = req.headers['x-api-key'];
  const expectedApiKey = process.env.API_KEY;
  
  if (expectedApiKey && apiKey !== expectedApiKey) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid API key'
    });
  }
  
  try {
    await refreshBuffer();
    return res.json({ 
      success: true,
      message: 'Buffer refreshed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error refreshing buffer:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to refresh buffer'
    });
  }
}); 