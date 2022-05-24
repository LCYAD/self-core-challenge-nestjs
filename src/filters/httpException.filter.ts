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
import { get, omit } from 'lodash'
import { UnauthorizedAccessException } from '../exceptions/unauthorizedAccess.exception'
import { APIRouteNotFoundException } from '../exceptions/apiRouteNotFound.exception'
import { UnknownServerErrorException } from 'src/exceptions/unknownServiceError.exception'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    let status
    let errContent
    let err
    let location
    try {
      if (exception instanceof NotFoundException) {
        throw new APIRouteNotFoundException()
      }
      if (exception instanceof UnauthorizedException) {
        throw new UnauthorizedAccessException()
      }
      if (
        !exception.getStatus ||
        (exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR &&
          !(exception instanceof HttpException))
      ) {
        throw new UnknownServerErrorException('see stack', exception.stack)
      }
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      location = get(exceptionResponse, 'location', 'unknown')
      err = get(exceptionResponse, 'err', null)
      errContent = omit(exceptionResponse as Record<string, unknown>, [
        'err',
        'location'
      ])
    } catch (e) {
      status = e.status
      ;({ location, err, ...errContent } = e.response)
    }
    console.error({
      status,
      location: {
        errorPoint: location
      },
      type: errContent.type,
      err
    })
    response.status(status).send({
      ...errContent
    })
  }
}
