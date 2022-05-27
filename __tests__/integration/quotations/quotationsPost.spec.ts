import { HttpStatus } from '@nestjs/common'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'

import _ from 'lodash'
import nano from 'nanoid'

import { COMMON_FIELD } from '@constants/fakers/common.faker.constant'
import { quotationsPostReqValidExample } from '@modules/quotations/dtos/quotationsPostReq.dto'
import { QuotationsHandler } from '@modules/quotations/quotations.handler'
import { QuotationsModule } from '@modules/quotations/quotations.module'
import {
  generateSequentialTests,
  mockGenericApp
} from '@tests/helper/e2e.helper'
import { redis } from '@utils/redis.util'

jest.mock('ioredis', () => require('ioredis-mock'))

const path = '/quotations'

describe(`POST ${path}`, () => {
  let app: NestFastifyApplication
  let quotationsHandler: QuotationsHandler
  let mockFunctionGroup

  beforeAll(async () => {
    jest.spyOn(Date, 'now').mockReturnValue(COMMON_FIELD.CURRENT_TIME_MILLI_SEC)
    jest
      .spyOn(nano, 'customAlphabet')
      .mockImplementation(() => () => COMMON_FIELD.QUOTATION_ID_FIELD as string)
    const appModule: NestFastifyApplication = (
      await mockGenericApp({
        module: {
          imports: [QuotationsModule]
        }
      })
    ).createNestApplication(new FastifyAdapter())

    quotationsHandler = appModule.get(QuotationsHandler)
    mockFunctionGroup = {
      spyHandlerCreateQuotations: jest
        .spyOn(quotationsHandler, 'createQuotations')
        .mockName('spyHandlerCreateQuotations'),
      spyRedisSet: jest.spyOn(redis, 'set').mockImplementation()
    }

    app = await appModule.init()
  })

  describe('success cases', () => {
    it('should return correct response', async () => {
      const response = await app.inject({
        method: 'POST',
        url: path,
        payload: [quotationsPostReqValidExample]
      })
      expect(response.statusCode).toEqual(HttpStatus.CREATED)
      generateSequentialTests({
        mockFunctionGroup,
        snapshots: ['spyHandlerCreateQuotations', 'spyRedisSet'],
        apiResponse: response
      })
    })
    it('should return correct response if coordinates is not provided', async () => {
      const response = await app.inject({
        method: 'POST',
        url: path,
        payload: [
          {
            ...quotationsPostReqValidExample,
            stops: [
              _.omit(quotationsPostReqValidExample.stops[0], ['coordinates']),
              _.omit(quotationsPostReqValidExample.stops[1], ['coordinates'])
            ]
          }
        ]
      })
      expect(response.statusCode).toEqual(HttpStatus.CREATED)
      generateSequentialTests({
        mockFunctionGroup,
        snapshots: ['spyHandlerCreateQuotations', 'spyRedisSet'],
        apiResponse: response
      })
    })
  })

  describe('error cases', () => {
    it('should throw Validation Error if body is invalid', async () => {
      const response = await app.inject({
        method: 'POST',
        url: path,
        payload: [_.omit(quotationsPostReqValidExample, ['deliveryBy'])]
      })
      expect(response.statusCode).toEqual(HttpStatus.UNPROCESSABLE_ENTITY)
      generateSequentialTests({
        mockFunctionGroup,
        notCalled: ['spyHandlerCreateQuotations', 'spyRedisSet'],
        apiResponse: response
      })
    })
    it('should throw Validation Error if scheduleAt is after deliveryBy ', async () => {
      const response = await app.inject({
        method: 'POST',
        url: path,
        payload: [
          {
            ...quotationsPostReqValidExample,
            scheduleAt: COMMON_FIELD.AFTER_1HR_CURRENT_TIME,
            deliveryBy: COMMON_FIELD.CURRENT_TIME
          }
        ]
      })
      expect(response.statusCode).toEqual(HttpStatus.UNPROCESSABLE_ENTITY)
      generateSequentialTests({
        mockFunctionGroup,
        notCalled: ['spyHandlerCreateQuotations', 'spyRedisSet'],
        apiResponse: response
      })
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
