# Dune Buffer Service

A standalone microservice that periodically fetches data from the Dune Analytics API and buffers it locally. This helps reduce Dune API credit usage by serving cached data instead of making repeated API requests.

## Features

- Fetches Dune API data once every 6 hours (configurable)
- Serves cached data through a RESTful API
- Includes a manual refresh endpoint
- Simple to deploy and configure

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   DUNE_API_KEY=your_dune_api_key
   DUNE_QUERY_ID=your_dune_query_id
   PORT=3001
   REFRESH_CRON="0 */6 * * *"  # Optional: Cron expression for refresh schedule
   API_KEY=your_api_key_for_refresh_endpoint  # Optional: Security for manual refresh
   ```
4. Build the project:
   ```
   npm run build
   ```
5. Start the service:
   ```
   npm start
   ```

## API Endpoints

### GET /api/swap-events
Returns all buffered swap events data.

**Response:**
```json
{
  "metadata": {
    "lastFetched": "2023-05-15T10:00:00.000Z",
    "count": 1000
  },
  "count": 1000,
  "events": [...]
}
```

### GET /api/swap-events/metadata
Returns metadata about the buffered swap events without the full data.

**Response:**
```json
{
  "metadata": {
    "lastFetched": "2023-05-15T10:00:00.000Z",
    "count": 1000
  },
  "count": 1000
}
```

### POST /api/swap-events/refresh
Manually triggers a data refresh from the Dune API.

**Headers:**
```
X-API-Key: your_api_key
```

**Response:**
```json
{
  "success": true,
  "message": "Buffer refreshed with 1000 events",
  "timestamp": "2023-05-15T10:05:00.000Z"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2023-05-15T10:10:00.000Z"
}
```

## Integration with Main Project

To use this service in your main project, update the `duneService.ts` file in your main project to fetch data from this buffer service instead of directly from Dune. For example:

```typescript
// Original:
const res = await axios.get(`https://api.dune.com/api/v1/query/${DUNE_QUERY_ID}/results?limit=${limit}&offset=${offset}`, {
  headers: { 'X-Dune-API-Key': DUNE_API_KEY }
});

// Updated:
const res = await axios.get(`http://localhost:3001/api/swap-events`);
// The events are in res.data.events
```

## Deployment

For production, consider deploying this service as a separate container or service that your main application can connect to.

## License

MIT 