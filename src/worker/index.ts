import { Worker, QueueEvents, type ConnectionOptions } from 'bullmq'

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
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    console.log(`Job ${job.id}, ${job.name} completed`)
  },
  { connection }
)

const queueEvents = new QueueEvents("job-queue", { connection })

queueEvents.on("completed", (jobId) => {
  console.log(`Job ${jobId} completed`)
})

queueEvents.on("failed", (jobId, err) => {
  console.log(`Job ${jobId} failed with error:`, err)
})

console.log("Worker started")