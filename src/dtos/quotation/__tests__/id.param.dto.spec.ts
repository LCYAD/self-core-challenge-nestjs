import {
  generateInvalidStringFormatTest,
  generateMissingFieldTest,
  generateValidBaseTest
} from '@tests/helper/dto.helper'

import {
  QuotationIdParamDto,
  quotationIdParamValidExample
} from '../id.param.dto'

describe('QuotationIdParamDto', () => {
  describe('valid response', () => {
    generateValidBaseTest(QuotationIdParamDto, quotationIdParamValidExample)
  })

  describe('invalid response', () => {
    generateMissingFieldTest(
      ['id'],
      QuotationIdParamDto,
      quotationIdParamValidExample
    )
    generateInvalidStringFormatTest(
      [{ key: 'id', invalidString: '1' }],
      QuotationIdParamDto,
      quotationIdParamValidExample
    )
  })
})
