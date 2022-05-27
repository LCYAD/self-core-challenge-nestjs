import { HttpStatus } from '@nestjs/common'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'

import { COMMON_FIELD } from '@constants/fakers/common.faker.constant'
import { quotationBaseValidExample } from '@dtos/quotation/base.dto'
import { QuotationsHandler } from '@modules/quotations/quotations.handler'
import { QuotationsModule } from '@modules/quotations/quotations.module'
import {
  generateSequentialTests,
  mockGenericApp
} from '@tests/helper/e2e.helper'
import { redis } from '@utils/redis.util'

jest.mock('ioredis', () => require('ioredis-mock'))

const path = `/quotations/${COMMON_FIELD.QUOTATION_ID_FIELD}`

describe('GET /quotations/:id', () => {
  let app: NestFastifyApplication
  let quotationsHandler: QuotationsHandler
  let mockFunctionGroup

  beforeAll(async () => {
    const appModule: NestFastifyApplication = (
      await mockGenericApp({
        module: {
          imports: [QuotationsModule]
        }
      })
    ).createNestApplication(new FastifyAdapter())

    quotationsHandler = appModule.get(QuotationsHandler)
    mockFunctionGroup = {
      spyHandlerGetQuotationById: jest
        .spyOn(quotationsHandler, 'getQuotationById')
        .mockName('spyHandlerGetQuotationById'),
      spyRedisGet: jest.spyOn(redis, 'get')
    }

    app = await appModule.init()
  })

  describe('success cases', () => {
    it('should return correct response', async () => {
      mockFunctionGroup.spyRedisGet.mockReturnValue(
        JSON.stringify(quotationBaseValidExample)
      )
      const response = await app.inject({
        method: 'GET',
        url: path
      })
      expect(response.statusCode).toEqual(HttpStatus.OK)
      generateSequentialTests({
        mockFunctionGroup,
        snapshots: ['spyHandlerGetQuotationById', 'spyRedisGet'],
        apiResponse: response
      })
    })
  })

  describe('error cases', () => {
    it('should throw Validation Error if quotation id is invalid', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/quotations/xxx'
      })
      expect(response.statusCode).toEqual(HttpStatus.UNPROCESSABLE_ENTITY)
      generateSequentialTests({
        mockFunctionGroup,
        notCalled: ['spyHandlerGetQuotationById', 'spyRedisGet'],
        apiResponse: response
      })
    })
    it('should throw error if quotation is not found', async () => {
      mockFunctionGroup.spyRedisGet.mockReturnValue()
      const response = await app.inject({
        method: 'GET',
        url: path
      })
      expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND)
      generateSequentialTests({
        mockFunctionGroup,
        snapshots: ['spyHandlerGetQuotationById', 'spyRedisGet'],
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
