import { DynamicModule, Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'

import { Logger, PinoLogger } from 'nestjs-pino'

import secret from '@config/secret'
import { HttpExceptionFilter } from '@filters/httpException.filter'
import { getValidationExceptionFactory } from '@utils/validation.util'

@Module({})
export class GenericE2ETestModule {
  static register({
    imports = [],
    controllers = [],
    providers = []
  }): DynamicModule {
    return {
      module: GenericE2ETestModule,
      imports: [
        ...imports,
        ConfigModule.forRoot({
          load: [secret]
        })
      ],
      controllers: [...controllers],
      providers: [
        ...providers,
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe({
            transform: true,
            whitelist: true,
            transformOptions: {
              excludeExtraneousValues: true
            },
            exceptionFactory: getValidationExceptionFactory({
              location: 'Generic Validation Pipe'
            })
          })
        },
        {
          provide: APP_FILTER,
          useFactory: () =>
            new HttpExceptionFilter(new Logger(new PinoLogger({}), {}))
        }
      ],
      exports: []
    }
  }
}
