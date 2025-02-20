import { Hono } from 'hono'

const app = new Hono()

app.get('/', async (c) => {
  return c.text('Hello World')
})

app.get('/healthz', async (c) => {
  return c.body('OK', 200)
})

export { app }