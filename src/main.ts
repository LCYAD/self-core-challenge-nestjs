import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { HttpExceptionFilter } from './filters/httpException.filter'
import { validationExceptionFactory } from './utils/validation.util'

const bootstrap = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        excludeExtraneousValues: true
      },
      exceptionFactory: validationExceptionFactory
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
