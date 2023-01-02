import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'

import type { FastifyReply } from 'fastify'
import { Logger } from 'nestjs-pino'

import { APIRouteNotFoundException } from '@exceptions/apiRouteNotFound.exception'
import { UnauthorizedAccessException } from '@exceptions/unauthorizedAccess.exception'
import { UnknownServerErrorException } from '@exceptions/unknownServiceError.exception'

type ExceptionResponse = {
  type: string
  detail: string | unknown[]
  code: string
  location: string
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()

    if (exception instanceof NotFoundException) {
      exception = new APIRouteNotFoundException()
    }
    if (exception instanceof UnauthorizedException) {
      exception = new UnauthorizedAccessException()
    }
    if (
      !exception.getStatus ||
      (exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR &&
        !(exception instanceof HttpException))
    ) {
      exception = new UnknownServerErrorException('see stack')
    }
    const status: number = exception.getStatus()
    const exceptionResponse = exception.getResponse() as ExceptionResponse
    const { location, ...errContent }: ExceptionResponse = exceptionResponse

    this.logger.error(errContent.type, {
      location,
      detail: errContent.detail,
      stackTrace: status === 500 ? exception.stack : null
    })

    void response.status(status).send(errContent)
  }
}
