import { OmitType } from '@nestjs/swagger'
import { omit } from 'lodash'
import {
  QuotationBaseDto,
  quotationBaseValidExample
} from 'src/dtos/quotation/base.dto'

export const omitFields = ['expireAt', 'quotationId'] as const

export const quotationsPostReqValidExample = omit(
  quotationBaseValidExample,
  omitFields
)

export class QuotationsPostReqDto extends OmitType(
  QuotationBaseDto,
  omitFields
) {}
