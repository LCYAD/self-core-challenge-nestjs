import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { LoggerModule } from 'nestjs-pino'

import secret from './config/secret'
import { QuotationsModule } from './modules/quotations/quotations.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [secret]
    }),
    QuotationsModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true
          }
        }
      },
      useExisting: true
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
