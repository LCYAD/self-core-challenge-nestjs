import { COMMON_FIELD } from '@constants/fakers/common.faker.constant'
import {
  generateInvalidArrayLargerThanMaxSizeTest,
  generateInvalidArraySmallerThanMinSizeTest,
  generateInvalidArrayTest,
  generateInvalidNestedObjectArrayTest,
  generateInvalidNestedObjectTest,
  generateInvalidNumberTest,
  generateInvalidStringFormatTest,
  generateMissingFieldTest,
  generateValidBaseTest,
  generateValidOptionalTest,
  testInvalid
} from '@tests/helper/dto.helper'

import {
  QuotationBaseDto,
  QuotationBaseItemDto,
  quotationBaseItemValidExample,
  quotationBaseValidExample
} from '../base.dto'
import { quotationStopValidExample } from '../stop.dto'

describe('QuotationBaseItemDto', () => {
  describe('valid response', () => {
    generateValidBaseTest(QuotationBaseItemDto, quotationBaseItemValidExample)
    generateValidOptionalTest(
      ['categories', 'handlingInstructions'],
      QuotationBaseItemDto,
      quotationBaseItemValidExample
    )
  })

  describe('invalid response', () => {
    generateMissingFieldTest(
      ['quantity', 'weight'],
      QuotationBaseItemDto,
      quotationBaseItemValidExample
    )
    generateInvalidArrayTest(
      ['categories', 'handlingInstructions'],
      QuotationBaseItemDto,
      quotationBaseItemValidExample
    )
    generateInvalidNumberTest(
      ['quantity', 'weight'],
      QuotationBaseItemDto,
      quotationBaseItemValidExample
    )
  })
})

describe('QuotationBaseDto', () => {
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockReturnValue(COMMON_FIELD.CURRENT_TIME_MILLI_SEC)
  })
  describe('valid response', () => {
    generateValidBaseTest(QuotationBaseDto, quotationBaseValidExample)
  })

  describe('invalid response', () => {
    generateMissingFieldTest(
      [
        'quotationId',
        'expireAt',
        'scheduleAt',
        'deliveryBy',
        'location',
        'stops',
        'item'
      ],
      QuotationBaseDto,
      quotationBaseValidExample
    )
    generateInvalidArrayTest(
      ['stops'],
      QuotationBaseDto,
      quotationBaseValidExample
    )
    generateInvalidStringFormatTest(
      [
        { key: 'quotationId', invalidString: 'xxx' },
        { key: 'expireAt', invalidString: 'xxx' },
        { key: 'scheduleAt', invalidString: 'xxx' },
        { key: 'deliveryBy', invalidString: 'xxx' }
      ],
      QuotationBaseDto,
      quotationBaseValidExample
    )
    generateInvalidArrayLargerThanMaxSizeTest(
      [
        {
          key: 'stops',
          allowedMaxSize: 2,
          data: quotationStopValidExample
        }
      ],
      QuotationBaseDto,
      quotationBaseValidExample
    )
    generateInvalidArraySmallerThanMinSizeTest(
      [
        {
          key: 'stops',
          allowedMinSize: 2,
          data: quotationStopValidExample
        }
      ],
      QuotationBaseDto,
      quotationBaseValidExample
    )
    generateInvalidNestedObjectArrayTest(
      ['stops'],
      QuotationBaseDto,
      quotationBaseValidExample
    )
    generateInvalidNestedObjectTest(
      ['item'],
      QuotationBaseDto,
      quotationBaseValidExample
    )
    it('for deliveryBy earlier than scheduledAt', (done) => {
      testInvalid(done)(QuotationBaseDto, {
        ...quotationBaseValidExample,
        deliveryBy: COMMON_FIELD.CURRENT_TIME,
        scheduleAt: COMMON_FIELD.AFTER_1HR_CURRENT_TIME
      })
    })
  })
})
