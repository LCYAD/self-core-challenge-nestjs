import { Injectable } from '@nestjs/common'
import { QuotationIdParamDto } from '../../dtos/quotation/id.param.dto'

@Injectable()
export class QuotationHandlerService {
  getQuotationById({ id }: QuotationIdParamDto) {
    return {
      quotationId: id
    }
  }
}
