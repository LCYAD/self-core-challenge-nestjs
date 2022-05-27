import nano from 'nanoid'

import { COMMON_FIELD } from '@constants/fakers/common.faker.constant'
import { quotationBaseValidExample } from '@dtos/quotation/base.dto'
import type { QuotationIdParamDto } from '@dtos/quotation/id.param.dto'
import { quotationIdParamValidExample } from '@dtos/quotation/id.param.dto'
import { ResourcesNotFoundException } from '@exceptions/resourcesNotFound.exception'
import { redis } from '@utils/redis.util'

import {
  QuotationsPostReqDto,
  quotationsPostReqValidExample
} from '../dtos/quotationsPostReq.dto'
import { QuotationsHandler } from '../quotations.handler'

jest.mock('ioredis', () => require('ioredis-mock'))

describe('QuotationsHandler', () => {
  let quotationHandler: QuotationsHandler
  let generateQuotationsHandler
  let spyRedisGet: jest.SpyInstance
  let spyRedisSet: jest.SpyInstance

  beforeAll(() => {
    generateQuotationsHandler = () => new QuotationsHandler()
    jest.spyOn(Date, 'now').mockReturnValue(COMMON_FIELD.CURRENT_TIME_MILLI_SEC)
    jest
      .spyOn(nano, 'customAlphabet')
      .mockImplementation(() => () => COMMON_FIELD.QUOTATION_ID_FIELD as string)
    spyRedisGet = jest.spyOn(redis, 'get')
    spyRedisSet = jest.spyOn(redis, 'set').mockImplementation()
  })

  describe('getQuotationById', () => {
    it('should return quotation', async () => {
      spyRedisGet.mockReturnValueOnce(JSON.stringify(quotationBaseValidExample))
      quotationHandler = generateQuotationsHandler()
      const result = await quotationHandler.getQuotationById(
        quotationIdParamValidExample as QuotationIdParamDto
      )
      expect(spyRedisGet).toHaveBeenCalledWith(quotationIdParamValidExample.id)
      expect(result).toEqual(quotationBaseValidExample)
    })
    it('should throw ResourcesNotFoundException if quotation is not found', async () => {
      spyRedisGet.mockReturnValueOnce(undefined)
      quotationHandler = generateQuotationsHandler()
      try {
        await quotationHandler.getQuotationById(
          quotationIdParamValidExample as QuotationIdParamDto
        )
      } catch (e) {
        expect(spyRedisGet).toHaveBeenCalledWith(
          quotationIdParamValidExample.id
        )
        expect(e).toBeInstanceOf(ResourcesNotFoundException)
      }
    })
  })

  describe('createQuotations', () => {
    it('should add quotation to redis and return quotation detail', async () => {
      const expectedResult = {
        ...quotationsPostReqValidExample,
        quotationId: COMMON_FIELD.QUOTATION_ID_FIELD,
        expireAt: new Date(
          COMMON_FIELD.CURRENT_TIME_MILLI_SEC + 5 * 60 * 1000
        ).toISOString()
      }
      quotationHandler = generateQuotationsHandler()
      const result = await quotationHandler.createQuotations([
        quotationsPostReqValidExample
      ] as QuotationsPostReqDto[])
      expect(spyRedisSet).toHaveBeenCalledWith(
        COMMON_FIELD.QUOTATION_ID_FIELD,
        JSON.stringify(expectedResult)
      )
      expect(result).toEqual([expectedResult])
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
