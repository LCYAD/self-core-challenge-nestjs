import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'

import { QuotationBaseDto } from '@dtos/quotation/base.dto'
import { QuotationIdParamDto } from '@dtos/quotation/id.param.dto'
import { ArrayValidationPipe } from '@pipes/arrayValidation.pipe'
import { parseDescription } from '@utils/swagger.util'
import { getValidationExceptionFactory } from '@utils/validation.util'

import { QuotationsPostReqDto } from './dtos/quotationsPostReq.dto'
import { QuotationHandlerService } from './quotations.handler.service'

const GET_QUOTATION_BY_ID_DESCRIPTION = parseDescription([
  'get quotation by quotation Id'
])

const POST_QUOTATION_DESCRIPTION = parseDescription(['batch create quotations'])

@Controller('quotations')
export class QuotationsController {
  constructor(
    private readonly quotationHandlerService: QuotationHandlerService
  ) {}

  @Get(':id')
  @ApiOperation({
    summary: 'GetQuotationById',
    description: GET_QUOTATION_BY_ID_DESCRIPTION
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: QuotationBaseDto
  })
  getQuotationById(@Param() param: QuotationIdParamDto) {
    return this.quotationHandlerService.getQuotationById(param)
  }

  @Post()
  @Get(':id')
  @ApiOperation({
    summary: 'PostQuotations',
    description: POST_QUOTATION_DESCRIPTION
  })
  @ApiBody({ type: [QuotationsPostReqDto] })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: QuotationBaseDto,
    isArray: true
  })
  postQuotations(
    @Body(
      new ArrayValidationPipe(
        QuotationsPostReqDto,
        getValidationExceptionFactory({
          isArray: true,
          location: 'Validation Pipe - postQuotations'
        })
      )
    )
    body: QuotationsPostReqDto[]
  ) {
    return this.quotationHandlerService.createQuotations(body)
  }
}
