import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches } from 'class-validator'
import { QUOTATION_ID_REGEX } from '../../constants/regexes/quotation.regex.constant'
import { COMMON_FIELD } from '../../constants/fakers/common.faker.constant'

export const quotationIdParamValidExample = {
  id: COMMON_FIELD.QUOTATION_ID_FIELD
}

export class QuotationIdParamDto {
  @IsString()
  @Matches(QUOTATION_ID_REGEX.regex)
  @ApiProperty({
    example: quotationIdParamValidExample.id,
    type: 'string'
  })
  readonly id: string
}
