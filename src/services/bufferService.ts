import { fetchDuneDataAsJson } from './duneService';

// In-memory storage for Dune data
let bufferData: any = null;

/**
 * Save Dune data to the in-memory buffer
 */
export function saveDuneData(data: any): void {
  const timestamp = new Date().toISOString();
  
  // Store the data with timestamp
  bufferData = {
    timestamp,
    data
  };
  
  console.log(`Saved Dune data to in-memory buffer at ${timestamp}`);
}

/**
 * Get Dune data from the in-memory buffer
 * If the buffer is empty, returns null
 */
export function getBufferedDuneData(): any {
  if (!bufferData) {
    console.log('No buffered data found in memory');
    return null;
  }
  
  return bufferData;
}

/**
 * Refresh the Dune data buffer by fetching from Dune API
 */
export async function refreshBuffer(): Promise<void> {
  console.log('Refreshing Dune data buffer...');
  
  try {
    const jsonData = await fetchDuneDataAsJson();
    const data = JSON.parse(jsonData);
    saveDuneData(data);
    console.log('Buffer refreshed successfully');
  } catch (error) {
    console.error('Failed to refresh buffer:', error);
    throw error;
  }
} 