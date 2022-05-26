import { HttpException, HttpStatus } from '@nestjs/common'

export class UnauthorizedAccessException extends HttpException {
  constructor(location = 'unknown', err = null) {
    super(
      {
        type: 'UNAUTHORIZED',
        code: '10002',
        detail: err ?? 'authorization token was not valid',
        location
      },
      HttpStatus.UNAUTHORIZED
    )
  }
}
