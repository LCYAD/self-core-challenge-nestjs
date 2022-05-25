import { Controller, Get, Param } from '@nestjs/common'
import { QuotationIdParamDto } from '../../dtos/quotation/id.param.dto'
import { QuotationHandlerService } from './quotations.service'

@Controller('quotations')
export class QuotationsController {
  constructor(
    private readonly quotationHandlerService: QuotationHandlerService
  ) {}

  @Get(':id')
  getQuotation(@Param() param: QuotationIdParamDto) {
    return this.quotationHandlerService.getQuotationById(param)
  }
}
