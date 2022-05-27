import { Module } from '@nestjs/common'

import { QuotationsController } from './quotations.controller'
import { QuotationHandler } from './quotations.handler'

@Module({
  imports: [],
  controllers: [QuotationsController],
  providers: [QuotationHandler]
})
export class QuotationsModule {}
