#!/usr/bin/env node
import { app } from '../index'
import axios from 'axios'
import assert from 'assert'
import dotenv from 'dotenv'
dotenv.config()
const url = process.env.URL_ADAPTER || 'http://localhost:8080/'

function testPacket (packet, response) {
  return async () => {
    const { data } = await axios.post(
      url,
      packet,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    if (response !== undefined) {
      assert.deepEqual(data, response)
    }
  }
}

describe('Test', () => {
  let server
  before(() => {
    server = app.listen(process.env.EA_PORT || 8080)
  })
  after(() => {
    server.close()
  })
  it('test', testPacket({
    service: 'bad service',
    data: { foo: [30, 10530, 'string'] },
    abi: 'ipfs'
  }, {
    feeCharged: 0,
    feeRefund: 0,
    feeSent: 0,
    queue: 'fail'
  }))
})

