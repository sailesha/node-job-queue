import { Hono } from 'hono'
import { jobQueue } from './queue.js'

const app = new Hono()

app.get('/', async (c) => {
  return c.text('Hello World')
})

app.get('/add', async (c) => {
  const data = c.req.query('data')!
  const jobId = c.req.query('id')!
  console.log(`Scheduling job ${jobId} with data:`, data)
  await jobQueue.add(jobId, { data })
  return c.body(`Job scheduled, id: ${jobId}`, 200)
})

app.get('/healthz', async (c) => {
  return c.body('OK', 200)
})

export { app }