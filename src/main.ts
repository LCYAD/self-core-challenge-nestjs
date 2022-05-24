import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ValidationException } from './exceptions/validation.exception'
import { HttpExceptionFilter } from './filters/httpException.filter'
import { getErrorMsg } from './utils/validation.util'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        throw new ValidationException('Validation Pipe', getErrorMsg(errors))
      }
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
bootstrap()
