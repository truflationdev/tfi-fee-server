#!/usr/bin/env node
import { app } from '../index'
import axios from 'axios'
import assert from 'assert'
import dotenv from 'dotenv'
dotenv.config()
const url: string = process.env.URL_ADAPTER ?? 'http://localhost:8080/'

function testPacket (packet, response): void {
  return async () => {
    const data = await axios.post(
      url,
      packet,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    if (response !== undefined) {
      assert.deepEqual(data?.data, response)
    }
  }
}

describe('Test', () => {
  let server
  before(() => {
    server = app.listen(process.env.EA_PORT ?? 8080)
  })
  after(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    server.close()
  })
  it('fail - no fee sent', testPacket({
    service: 'bad service',
    data: { foo: [30, 10530, 'string'] },
    abi: 'ipfs'
  }, {
    feeCharged: 0,
    feeRefund: 0,
    feeSent: 0,
    queue: 'fail'
  }))
  it('fail - garbagefee', testPacket({
    service: 'bad service',
    data: { foo: [30, 10530, 'string'] },
    abi: 'ipfs',
    feeSent: 'garbage'
  }, {
    feeCharged: 0,
    feeRefund: 0,
    feeSent: 0,
    queue: 'fail'
  }))
  it('fail - fee sent', testPacket({
    service: 'bad service',
    data: { foo: [30, 10530, 'string'] },
    abi: 'ipfs',
    feeSent: 1000
  }, {
    feeCharged: 0,
    feeRefund: 1000,
    feeSent: 1000,
    queue: 'fail'
  }))
  it('fail - string sent', testPacket({
    service: 'bad service',
    data: { foo: [30, 10530, 'string'] },
    abi: 'ipfs',
    feeSent: '1000'
  }, {
    feeCharged: 0,
    feeRefund: 1000,
    feeSent: 1000,
    queue: 'fail'
  }))
  it('pass - edge case', testPacket({
    service: 'bad service',
    data: { foo: [30, 10530, 'string'] },
    abi: 'ipfs',
    feeSent: 100000000000000000
  }, {
    feeCharged: 100000000000000000,
    feeRefund: 0,
    feeSent: 100000000000000000,
    queue: 'main'
  }))
  it('pass - edge case', testPacket({
    service: 'bad service',
    data: { foo: [30, 10530, 'string'] },
    abi: 'ipfs',
    feeSent: 100000000000000200
  }, {
    feeCharged: 100000000000000000,
    feeRefund: 200,
    feeSent: 100000000000000200,
    queue: 'main'
  }))
})
