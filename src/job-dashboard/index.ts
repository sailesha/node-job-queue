import Arena from 'bull-arena';
import { Queue } from 'bullmq'
import express from 'express'

const REDIS_URL = process.env.REDIS_URL
if (!REDIS_URL) {
  console.error("REDIS_URL environment variable is required")
  process.exit(1)
}
console.log("Connecting to Redis at", REDIS_URL)
const connection = { url: REDIS_URL }

const arena = Arena({
  BullMQ: Queue,
  queues: [
    {
      type: 'bullmq',
      name: "job-queue",
      hostId: "BullMQ Server",
      redis: connection,
    }
  ],
}, {
  basePath: "/",
  disableListen: true
})

const app = express()
app.use('/', arena)

export { app }