import { Queue, type ConnectionOptions } from "bullmq"

const connection: ConnectionOptions = { url: process.env.REDIS_URL! }

export const jobQueue = new Queue("job-queue", { connection })