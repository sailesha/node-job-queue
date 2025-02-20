import { Queue, type ConnectionOptions } from "bullmq"

const REDIS_URL = process.env.REDIS_URL
if (!REDIS_URL) {
  console.error("REDIS_URL environment variable is required")
  process.exit(1)
}
console.log("Connecting to Redis at", REDIS_URL)
const connection: ConnectionOptions = { url: REDIS_URL }

export const jobQueue = new Queue("job-queue", { connection })