import { Worker, QueueEvents, type ConnectionOptions, Job } from 'bullmq'

const REDIS_URL = process.env.REDIS_URL
if (!REDIS_URL) {
  console.error("REDIS_URL environment variable is required")
  process.exit(1)
}
console.log("Connecting to Redis at", REDIS_URL)
const connection: ConnectionOptions = { url: REDIS_URL }

const worker = new Worker(
  "job-queue",
  async job => {
    console.log(`Processing job ${job.id}, name: ${job.name}, data:`, job.data)
    // If job.data has the word "error" in it, throw an error.
    if (job.data.data?.includes("error")) {
      throw new Error("Job failed")
    }
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    console.log(`Job ${job.id}, ${job.name} completed`)
  },
  {
    autorun: true,
    connection,
    concurrency: 3,
  }
)

worker.on('error', (err) => {
  // TODO: Report to bugsnag.
  console.error('Worker error:', err)
})

worker.on('failed', (job: Job | undefined, error: Error, prev: string) => {
  console.error(`Worker, Job ${job?.id} failed with error:`, error, 'prev', prev)
})

const telemetryWorker = new Worker(
  "telemetry-queue",
  async job => {
    console.log(`Processing telemetry job ${job.id}, name: ${job.name}, data:`, job.data)
    // If job.data has the word "error" in it, throw an error.
    if (job.data.data?.includes("error")) {
      throw new Error("Job failed")
    }
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    console.log(`Telemetry job ${job.id}, ${job.name} completed`)
  },
  {
    autorun: true,
    connection,
    concurrency: 1,
  }
)

telemetryWorker.on('error', (err) => {
  // TODO: Report to bugsnag.
  console.error('Telemetry worker error:', err)
})

telemetryWorker.on('failed', (job: Job | undefined, error: Error, prev: string) => {
  console.error(`Telemetry worker, Job ${job?.id} failed with error:`, error, 'prev', prev)
})

const queueEvents = new QueueEvents("job-queue", { connection })

queueEvents.on("completed", (args) => {
  console.log(`Job ${args.jobId} completed`)
})

queueEvents.on("failed", (args) => {
  console.log(`Job ${args.jobId}, failed with error:`, args.failedReason)
})

const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}, closing server...`);
  await Promise.allSettled([
    worker.close(),
    telemetryWorker.close()
  ])
  // Other asynchronous closings
  process.exit(0);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

console.log("Worker started")