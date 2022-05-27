import { Module } from '@nestjs/common'

import { QuotationsController } from './quotations.controller'
import { QuotationsHandler } from './quotations.handler'

@Module({
  imports: [],
  controllers: [QuotationsController],
  providers: [QuotationsHandler]
})
export class QuotationsModule {}
