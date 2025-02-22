import { Queue, type ConnectionOptions } from "bullmq"

const REDIS_URL = process.env.REDIS_URL
if (!REDIS_URL) {
  console.error("REDIS_URL environment variable is required")
  process.exit(1)
}
console.log("Connecting to Redis at", REDIS_URL)
const connection: ConnectionOptions = { url: REDIS_URL }

export const jobQueue = new Queue(
  "job-queue",
  {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    }
  }
)

// Queue to process telemetry data. Concurrency is limited to 1 to prevent
// multiple telemetry jobs from running at the same time. Also, telemetry
// jobs are not retried since failures can be retried in subsequent jobs.
export const telemetryQueue = new Queue(
  "telemetry-queue",
  {
    connection,
    defaultJobOptions: {
      attempts: 1,
    }
  }
)