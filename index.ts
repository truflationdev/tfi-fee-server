import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = 3000

app.get('/', (req: Request, res: Response) => {
  res.json({ fee: 100000000000000000 })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
