import { Injectable } from '@nestjs/common'
import { QUOTATION } from '../../constants/fakers/quotation'

@Injectable()
export class QuotationHandlerService {
  getQuotationById() {
    return QUOTATION
  }
}
