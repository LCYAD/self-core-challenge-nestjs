import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Post
} from '@nestjs/common'
import { validationExceptionFactory } from '../../utils/validation.util'
import { QuotationIdParamDto } from '../../dtos/quotation/id.param.dto'
import { QuotationsPostReqDto } from './dtos/quotationsPostReq.dto'
import { QuotationHandlerService } from './quotations.handler.service'

@Controller('quotations')
export class QuotationsController {
  constructor(
    private readonly quotationHandlerService: QuotationHandlerService
  ) {}

  @Get(':id')
  getQuotation(@Param() param: QuotationIdParamDto) {
    return this.quotationHandlerService.getQuotationById(param)
  }

  @Post()
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
