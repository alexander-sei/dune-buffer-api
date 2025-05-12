/**
 * Example file showing how to integrate the Dune Buffer Service with the main project
 * This would replace the original duneService.ts in the main project
 */
import axios from 'axios';
import { SwapEvent } from './models/SwapEvent';

// Buffer service URL
const BUFFER_SERVICE_URL = process.env.BUFFER_SERVICE_URL || 'http://localhost:3001';

// Maximum number of retries for API calls
const MAX_RETRIES = 3;
// Delay between retries (in ms)
const RETRY_DELAY = 1000;

/**
 * Fetches swap events from the buffer service
 */
export async function fetchSwapEvents(limit: number, offset: number, retryCount = 0): Promise<SwapEvent[]> {
  try {
    console.log(`Fetching events from buffer service: limit=${limit}, offset=${offset}`);
    
    const res = await axios.get(`${BUFFER_SERVICE_URL}/api/swap-events`);
    
    if (!res.data?.events || !Array.isArray(res.data.events)) {
      console.error('Invalid response format from buffer service:', res.data);
      return [];
    }
    
    // Get a slice of the data based on the limit and offset
    const allEvents = res.data.events as SwapEvent[];
    const slicedEvents = allEvents.slice(offset, offset + limit);
    
    console.log(`Retrieved ${slicedEvents.length} events from buffer (from total ${allEvents.length})`);
    
    return slicedEvents;
  } catch (error) {
    console.error(`Error fetching events from buffer service (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`, error);
    
    // Retry logic
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchSwapEvents(limit, offset, retryCount + 1);
    }
    
    // If all retries fail, return empty array
    console.error('All retry attempts failed');
    return [];
  }
}

/**
 * Fetches all swap events with pagination
 * This function now uses the buffer service instead of Dune API directly
 */
export async function fetchAllSwapEvents(maxEvents = Infinity): Promise<SwapEvent[]> {
  try {
    console.log('Fetching all swap events from buffer service');
    
    // Since we're using the buffer service, we can get all events at once
    const res = await axios.get(`${BUFFER_SERVICE_URL}/api/swap-events`);
    
    if (!res.data?.events || !Array.isArray(res.data.events)) {
      console.error('Invalid response format from buffer service:', res.data);
      return [];
    }
    
    const allEvents = res.data.events as SwapEvent[];
    
    // Apply the maxEvents limit if needed
    const limitedEvents = maxEvents < allEvents.length 
      ? allEvents.slice(0, maxEvents) 
      : allEvents;
    
    console.log(`Fetched ${limitedEvents.length} events from buffer service`);
    return limitedEvents;
  } catch (error) {
    console.error('Failed to fetch events from buffer service:', error);
    return [];
  }
} 