import { HttpException, HttpStatus } from '@nestjs/common'

export class UnauthorizedAccessException extends HttpException {
  constructor(location = 'unknown', err = null) {
    super(
      {
        title: 'Unauthorized access!',
        type: 'UnauthorizedAccessError',
        errorCode: '10200',
        message: 'authorization token was not valid',
        location,
        err
      },
      HttpStatus.UNAUTHORIZED
    )
  }
}
