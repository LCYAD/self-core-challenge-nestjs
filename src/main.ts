import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { Logger } from 'nestjs-pino'
import uniqid from 'uniqid'

import { AppModule } from './app.module'
import config from './config'
import { HttpExceptionFilter } from './filters/httpException.filter'
import { getValidationExceptionFactory } from './utils/validation.util'

const bootstrap = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true
          }
        }
      },
      genReqId: () => uniqid(`${config().reqIdPrefix}-`)
    }),
    { bufferLogs: true }
  )
  const pinoLogger = app.get(Logger)
  app.useLogger(pinoLogger)
  app.useGlobalFilters(new HttpExceptionFilter(pinoLogger))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        excludeExtraneousValues: true
      },
      exceptionFactory: getValidationExceptionFactory({
        location: 'Generic Validation Pipe'
      })
    })
  )
  const configService = app.get(ConfigService)
  if (configService.get<string>('appEnv') !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('NestJS Self Challenge API API')
      .setDescription('An API to get quotation information')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('api', app, document)
  }

  await app.listen(configService.get<string>('port'))
}
void bootstrap()
