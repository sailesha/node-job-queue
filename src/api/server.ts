import { app } from "./index.js"
import { serve } from '@hono/node-server'

const port = 8000
serve({
  fetch: app.fetch,
  port
}).on('listening', () => {
  console.log(`Server listening on port ${port}`)
})