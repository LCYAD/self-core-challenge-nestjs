import { ApiProperty } from '@nestjs/swagger'

import { Expose } from 'class-transformer'
import { IsString, Matches } from 'class-validator'

import { COMMON_FIELD } from '@constants/fakers/common.faker.constant'
import { QUOTATION_ID_REGEX } from '@constants/regexes/quotation.regex.constant'

export const quotationIdParamValidExample = {
  id: COMMON_FIELD.QUOTATION_ID_FIELD
}

export class QuotationIdParamDto {
  @Expose()
  @IsString()
  @Matches(QUOTATION_ID_REGEX.regex)
  @ApiProperty({
    example: quotationIdParamValidExample.id,
    type: 'string'
  })
  readonly id: string
}
