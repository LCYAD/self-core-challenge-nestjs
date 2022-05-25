import { HttpException, HttpStatus } from '@nestjs/common'

export class UnknownServerErrorException extends HttpException {
  constructor(location = 'unknown', err = null) {
    super(
      {
        type: 'SERVER_ERROR',
        code: '10000',
        detail: err ?? 'Unknown error, see error log',
        location
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
