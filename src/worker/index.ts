import { Worker, QueueEvents, type ConnectionOptions } from 'bullmq'

const connection: ConnectionOptions = { url: process.env.REDIS_URL! }

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