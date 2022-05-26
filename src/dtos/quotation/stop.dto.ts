import { ApiProperty } from '@nestjs/swagger'

import { Expose, Type } from 'class-transformer'
import { IsOptional, IsString, Matches, ValidateNested } from 'class-validator'

import { COMMON_FIELD } from '@constants/fakers/common.faker.constant'
import {
  LAT__REGEX,
  LNG__REGEX
} from '@constants/regexes/common.regex.constant'

export const quotationStopCoordinatesValidExample = {
  lat: COMMON_FIELD.LAT,
  lng: COMMON_FIELD.LNG
}

export const quotationStopValidExample = {
  coordinates: quotationStopCoordinatesValidExample,
  address: COMMON_FIELD.PICKUP_ADDRESS
}

export class QuotationStopCoordinatesDto {
  @Expose()
  @IsString()
  @Matches(LAT__REGEX.regex)
  @ApiProperty({
    example: quotationStopCoordinatesValidExample.lat,
    description: 'should range between -90 and 90 with a max 6 decimals',
    type: 'string',
    format: LAT__REGEX.swaggerPattern
  })
  readonly lat: string

  @Expose()
  @IsString()
  @Matches(LNG__REGEX.regex)
  @ApiProperty({
    example: quotationStopCoordinatesValidExample.lng,
    description: 'should range between -180 and 180 with a max 6 decimals',
    type: 'string',
    format: LNG__REGEX.swaggerPattern
  })
  readonly lng: string
}

export class QuotationStopDto {
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => QuotationStopCoordinatesDto)
  @ApiProperty({
    example: quotationStopValidExample.coordinates,
    type: QuotationStopCoordinatesDto,
    required: false
  })
  readonly coordinates?: QuotationStopCoordinatesDto

  @Expose()
  @IsString()
  @ApiProperty({
    example: quotationStopValidExample.address,
    type: 'string'
  })
  readonly address: string
}
