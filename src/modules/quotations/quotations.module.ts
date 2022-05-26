import { Module } from '@nestjs/common'
import { QuotationsController } from './quotations.controller'
import { QuotationHandlerService } from './quotations.handler.service'

@Module({
  imports: [],
  controllers: [QuotationsController],
  providers: [QuotationHandlerService]
})
export class QuotationsModule {}
