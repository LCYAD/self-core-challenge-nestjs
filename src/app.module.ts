import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { QuotationsModule } from './modules/quotations/quotations.module'

@Module({
  imports: [QuotationsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
