import {
  generateInvalidStringFormatTest,
  generateMissingFieldTest,
  generateValidBaseTest,
  generateValidOptionalTest
} from '@tests/helper/dto.helper'

import {
  QuotationStopCoordinatesDto,
  quotationStopCoordinatesValidExample,
  QuotationStopDto,
  quotationStopValidExample
} from '../stop.dto'

describe('QuotationStopCoordinatesDto', () => {
  describe('valid response', () => {
    generateValidBaseTest(
      QuotationStopCoordinatesDto,
      quotationStopCoordinatesValidExample
    )
  })

  describe('invalid response', () => {
    generateMissingFieldTest(
      ['lat', 'lng'],
      QuotationStopCoordinatesDto,
      quotationStopCoordinatesValidExample
    )
    generateInvalidStringFormatTest(
      [
        { key: 'lat', invalidString: 'abc' },
        { key: 'lng', invalidString: 'abc' }
      ],
      QuotationStopCoordinatesDto,
      quotationStopCoordinatesValidExample
    )
  })
})

describe('QuotationStopDto', () => {
  describe('valid response', () => {
    generateValidBaseTest(QuotationStopDto, quotationStopValidExample)
    generateValidOptionalTest(
      ['coordinates'],
      QuotationStopDto,
      quotationStopValidExample
    )
  })

  describe('invalid response', () => {
    generateMissingFieldTest(
      ['address'],
      QuotationStopDto,
      quotationStopValidExample
    )
  })
})
