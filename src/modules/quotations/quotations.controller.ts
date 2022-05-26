import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseArrayPipe,
  Post
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import _ from 'lodash'
import { validationExceptionFactory } from '../../utils/validation.util'
import { QuotationIdParamDto } from '../../dtos/quotation/id.param.dto'
import { QuotationsPostReqDto } from './dtos/quotationsPostReq.dto'
import { QuotationHandlerService } from './quotations.handler.service'
import { parseDescription } from 'src/utils/swagger.util'
import { QuotationBaseDto } from 'src/dtos/quotation/base.dto'

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
      new ParseArrayPipe({
        items: QuotationsPostReqDto,
        exceptionFactory: validationExceptionFactory
      })
    )
    body: QuotationsPostReqDto[]
  ) {
    return this.quotationHandlerService.createQuotations(body)
  }
}
