import { Hono } from 'hono'
import { jobQueue, telemetryQueue } from './queue.js'

const app = new Hono()

app.get('/', async (c) => {
  return c.text('Hello World')
})

app.post('/add', async (c) => {
  const data = c.req.query('data')!
  const jobName = c.req.query('id')!
  console.log(`Scheduling job ${jobName} with data:`, data)
  await jobQueue.add(
    jobName,
    { data },
    {
      attempts: 3,
      // backoff: {
      //   type: 'exponential',
      //   delay: 1000,
      // },
    }
  )
  return c.body(`Job scheduled, name: ${jobName}`, 200)
})

app.get('/healthz', async (c) => {
  return c.body('OK', 200)
})

telemetryQueue.upsertJobScheduler('telemetry-job-id',
  { every: 1000, },
  {
    name: "telemetry-job",
    data: { data: 'telemetry-job-data' },
  }
)

export { app }