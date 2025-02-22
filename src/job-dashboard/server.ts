import { app } from "./index.js"

const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 5000
app.listen(port, () => {
  console.log(`BullMQ Dashboard listening on port ${port}`)
})