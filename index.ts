import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import BigNumber from 'bignumber.js'
import bodyParser from 'body-parser'

dotenv.config()

export const app: Express = express()
const port = 8080

app.use(bodyParser.json())

app.post('/', (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  let feeSent = BigNumber(req?.body?.feeSent)
  if (feeSent.isNaN()) {
    feeSent = BigNumber(0)
  }

  const feeCharged = BigNumber(100000000000000000)
  if (feeSent < feeCharged) {
    res.json({
      queue: 'fail',
      feeSent,
      feeCharged: 0,
      feeRefund: feeSent
    })
    return
  }
  res.json({
    queue: 'main',
    feeSent,
    feeCharged,
    feeRefund: feeSent.minus(feeCharged)
  })
})

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Fee server app listening on port ${port}`)
  })
}
