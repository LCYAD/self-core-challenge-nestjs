import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import secret from './config/secret'
import { QuotationsModule } from './modules/quotations/quotations.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [secret]
    }),
    QuotationsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
