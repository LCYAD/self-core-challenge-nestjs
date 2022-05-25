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
import { UnauthorizedAccessException } from '../exceptions/unauthorizedAccess.exception'
import { APIRouteNotFoundException } from '../exceptions/apiRouteNotFound.exception'
import { UnknownServerErrorException } from 'src/exceptions/unknownServiceError.exception'

type ExceptionResponse = {
  type: string
  detail: string | unknown[]
  code: string
  location: string
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
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
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse() as ExceptionResponse
    const { location, ...errContent }: ExceptionResponse = exceptionResponse

    // TODO: replace with proper logger
    console.error({
      status,
      location,
      type: errContent.type,
      detail: errContent.detail,
      stackTrace: status === 500 ? exception.stack : null
    })

    response.status(status).send(errContent)
  }
}
