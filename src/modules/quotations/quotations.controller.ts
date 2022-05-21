import { Controller, Get } from '@nestjs/common'
import { QuotationHandlerService } from './quotations.service'

@Controller('quotations')
export class QuotationsController {
  constructor(
    private readonly quotationHandlerService: QuotationHandlerService
  ) {}

  @Get(':id')
  getQuotation() {
    return this.quotationHandlerService.getQuotationById()
  }
}
