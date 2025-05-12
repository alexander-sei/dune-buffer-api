import cron from 'node-cron';
import { refreshBuffer } from './bufferService';

// Default refresh schedule: every 6 hours
const DEFAULT_SCHEDULE = '0 */6 * * *';

let refreshTask: cron.ScheduledTask | null = null;

/**
 * Initialize the scheduler to refresh the buffer at regular intervals
 */
export function initScheduler(): void {
  const cronExpression = process.env.REFRESH_CRON || DEFAULT_SCHEDULE;
  
  // Validate cron expression
  if (!cron.validate(cronExpression)) {
    console.error(`Invalid cron expression: ${cronExpression}, using default`);
    startScheduler(DEFAULT_SCHEDULE);
  } else {
    startScheduler(cronExpression);
  }
}

/**
 * Start the scheduler with the given cron expression
 */
function startScheduler(cronExpression: string): void {
  if (refreshTask) {
    refreshTask.stop();
  }
  
  console.log(`Scheduling buffer refresh with cron: ${cronExpression}`);
  
  refreshTask = cron.schedule(cronExpression, async () => {
    console.log(`Executing scheduled refresh at ${new Date().toISOString()}`);
    try {
      await refreshBuffer();
      console.log('Scheduled refresh completed successfully');
    } catch (error) {
      console.error('Scheduled refresh failed:', error);
    }
  });
  
  console.log('Scheduler initialized');
}

/**
 * Stop the scheduler
 */
export function stopScheduler(): void {
  if (refreshTask) {
    refreshTask.stop();
    refreshTask = null;
    console.log('Scheduler stopped');
  }
} 