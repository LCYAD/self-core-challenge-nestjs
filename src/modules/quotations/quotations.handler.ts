import { Injectable } from '@nestjs/common'

import _ from 'lodash'
import { customAlphabet } from 'nanoid'

import type { QuotationBaseDto } from '@dtos/quotation/base.dto'
import { QuotationIdParamDto } from '@dtos/quotation/id.param.dto'
import { ResourcesNotFoundException } from '@exceptions/resourcesNotFound.exception'
import { redis } from '@utils/redis.util'

import type { QuotationsPostReqDto } from './dtos/quotationsPostReq.dto'

@Injectable()
export class QuotationsHandler {
  async getQuotationById({ id }: QuotationIdParamDto) {
    const quotation = await redis.get(id)
    if (!quotation) {
      throw new ResourcesNotFoundException(
        'QuotationsHandler:getQuotationById',
        'Quotation not found'
      )
    }
    return JSON.parse(quotation)
  }

  async createQuotations(body: QuotationsPostReqDto[]) {
    const now = Date.now()
    const duration = 5 * 60 * 1000
    const expireAt = new Date(now + duration).toISOString()
    const generateQuotationId = () => customAlphabet('0123456789', 12)()
    const quotations = _.map(body, (quotation) => ({
      ...quotation,
      quotationId: generateQuotationId(),
      expireAt
    }))
    await Promise.all(
      _.map(quotations, (quotation: QuotationBaseDto) =>
        redis.set(quotation.quotationId, JSON.stringify(quotation))
      )
    )
    return quotations
  }
}
