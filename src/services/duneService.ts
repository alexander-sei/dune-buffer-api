import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DUNE_API_KEY = process.env.DUNE_API_KEY!;
const DUNE_QUERY_ID = process.env.DUNE_QUERY_ID!;

// Maximum number of retries for API calls
const MAX_RETRIES = 3;
// Delay between retries (in ms)
const RETRY_DELAY = 1000;

/**
 * Fetches raw data from Dune API and returns it as a JSON string
 */
export async function fetchDuneDataAsJson(retryCount = 0): Promise<string> {
  try {
    // Using a reasonably large limit to get all data at once
    const limit = 10000;
    const url = `https://api.dune.com/api/v1/query/${DUNE_QUERY_ID}/results?limit=${limit}`;
    console.log(`Fetching data from Dune API...`);
    
    const res = await axios.get(url, {
      headers: { 'X-Dune-API-Key': DUNE_API_KEY }
    });
    
    // Convert the response to a JSON string without any processing
    return JSON.stringify(res.data);
  } catch (error) {
    console.error(`Error fetching data from Dune (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`, error);
    
    // Retry logic
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchDuneDataAsJson(retryCount + 1);
    }
    
    // If all retries fail, return empty JSON
    console.error('All retry attempts failed');
    return JSON.stringify({ error: 'Failed to fetch data from Dune API' });
  }
} 