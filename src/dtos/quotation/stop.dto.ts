import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsString, Matches, ValidateNested } from 'class-validator'
import { COMMON_FIELD } from '../../constants/fakers/common.faker.constant'
import { LAT_LNG_REGEX } from '../../constants/regexes/common.regex.constant'

export const quotationStopCoordinatesValidExample = {
  lat: COMMON_FIELD.LAT,
  lng: COMMON_FIELD.LNG
}

export const quotationStopValidExample = {
  coordinates: quotationStopCoordinatesValidExample,
  address: COMMON_FIELD.PICKUP_ADDRESS
}

export class QuotationStopCoordinatesDto {
  @IsString()
  @Matches(LAT_LNG_REGEX.regex)
  @ApiProperty({
    example: quotationStopCoordinatesValidExample.lat,
    type: 'string',
    format: LAT_LNG_REGEX.swaggerPattern
  })
  readonly lat: string

  @IsString()
  @Matches(LAT_LNG_REGEX.regex)
  @ApiProperty({
    example: quotationStopCoordinatesValidExample.lng,
    type: 'string',
    format: LAT_LNG_REGEX.swaggerPattern
  })
  readonly lng: string
}

export class QuotationStopDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => QuotationStopCoordinatesDto)
  @ApiProperty({
    example: quotationStopValidExample.coordinates,
    type: QuotationStopCoordinatesDto,
    required: false
  })
  readonly coordinates?: QuotationStopCoordinatesDto

  @IsString()
  @ApiProperty({
    example: quotationStopValidExample.address,
    type: 'string'
  })
  readonly address: string
}
