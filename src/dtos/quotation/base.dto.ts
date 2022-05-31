import { ApiProperty } from '@nestjs/swagger'

import { Expose, Type } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested
} from 'class-validator'

import { COMMON_FIELD } from '@constants/fakers/common.faker.constant'
import { QUOTATION_ID_REGEX } from '@constants/regexes/quotation.regex.constant'
import { IsLaterThan } from '@decorators/validation/isLaterThan.decorator'

import { QuotationStopDto, quotationStopValidExample } from './stop.dto'

export const quotationBaseItemValidExample = {
  quantity: COMMON_FIELD.NUMBER_FIELD,
  weight: COMMON_FIELD.NUMBER_FIELD,
  categories: [COMMON_FIELD.STRING_FIELD],
  handlingInstructions: [COMMON_FIELD.STRING_FIELD]
}

export const quotationBaseValidExample = {
  quotationId: COMMON_FIELD.QUOTATION_ID_FIELD,
  expireAt: COMMON_FIELD.AFTER_5_MINS_CURRENT_TIME,
  scheduleAt: COMMON_FIELD.AFTER_5_MINS_CURRENT_TIME,
  deliveryBy: COMMON_FIELD.AFTER_1HR_CURRENT_TIME,
  stops: [
    {
      ...quotationStopValidExample,
      address: COMMON_FIELD.PICKUP_ADDRESS
    },
    {
      ...quotationStopValidExample,
      address: COMMON_FIELD.DROP_OFF_ADDRESS
    }
  ],
  location: COMMON_FIELD.LOCATION,
  item: quotationBaseItemValidExample
}

export class QuotationBaseItemDto {
  @Expose()
  @IsNumber()
  @ApiProperty({
    example: quotationBaseItemValidExample.quantity,
    type: 'number'
  })
  readonly quantity: number

  @Expose()
  @IsNumber()
  @ApiProperty({
    example: quotationBaseItemValidExample.weight,
    type: 'number'
  })
  readonly weight: number

  @Expose()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: quotationBaseItemValidExample.categories,
    type: 'string',
    isArray: true
  })
  readonly categories?: string[]

  @Expose()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: quotationBaseItemValidExample.handlingInstructions,
    type: 'string',
    isArray: true
  })
  readonly handlingInstructions?: string[]
}

export class QuotationBaseDto {
  @Expose()
  @IsString()
  @Matches(QUOTATION_ID_REGEX.regex)
  @ApiProperty({
    example: quotationBaseValidExample.quotationId,
    type: 'string'
  })
  readonly quotationId: string

  @Expose()
  @IsDateString()
  @ApiProperty({
    example: quotationBaseValidExample.expireAt,
    type: 'string',
    format: 'date-time'
  })
  readonly expireAt: string

  @Expose()
  @IsDateString()
  @IsLaterThan([{ key: 'now' }])
  @ApiProperty({
    example: quotationBaseValidExample.scheduleAt,
    type: 'string',
    format: 'date-time'
  })
  readonly scheduleAt: string

  @Expose()
  @IsDateString()
  @IsLaterThan<'scheduleAt'>([{ key: 'scheduleAt' }, { key: 'now' }])
  @ApiProperty({
    example: quotationBaseValidExample.deliveryBy,
    type: 'string',
    format: 'date-time'
  })
  readonly deliveryBy: string

  @Expose()
  @IsString()
  @ApiProperty({
    example: quotationBaseValidExample.location,
    type: 'string',
    format: 'date-time'
  })
  readonly location: string

  @Expose()
  @IsDefined()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => QuotationStopDto)
  @ApiProperty({
    example: quotationBaseValidExample.stops,
    description: 'pickup and dropoff stops',
    type: QuotationStopDto,
    isArray: true,
    minItems: 2,
    maxItems: 2
  })
  readonly stops: [QuotationStopDto, QuotationStopDto]

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => QuotationBaseItemDto)
  @ApiProperty({
    example: quotationBaseValidExample.item,
    type: QuotationBaseItemDto
  })
  readonly item: QuotationBaseItemDto
}
