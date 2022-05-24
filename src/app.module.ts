import { Module } from '@nestjs/common'
import { QuotationsModule } from './modules/quotations/quotations.module'

@Module({
  imports: [QuotationsModule],
  controllers: [],
  providers: []
})
export class AppModule {}
