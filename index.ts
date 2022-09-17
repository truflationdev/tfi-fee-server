import express, { Request, Response } from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = 8080

app.post('/', (req: Request, res: Response) => {
  let feeSent: number = parseInt(toString(req.feeSent))
  if (isNaN(feeSent)) {
    feeSent = 0
  }
  const feeCharged = 100000000000000000
  if (feeSent < feeCharged) {
    res.json({
      queue: 'fail',
      feeSent: feeSent,
      feeCharged: 0,
      feeRefund: feeSent
    })
    return
  }
  res.json({
    queue: 'main',
    feeSent: feeSent,
    feeCharged: feeCharged,
    feeRefund: feeSent - feeSent
  })
})

module.exports = {
  app
}

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Fee server app listening on port ${port}`)
  })
}
