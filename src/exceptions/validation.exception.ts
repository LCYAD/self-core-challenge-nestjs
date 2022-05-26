import { HttpException, HttpStatus } from '@nestjs/common'

export class ValidationException extends HttpException {
  constructor(location = 'unknown', err = null) {
    super(
      {
        type: 'VALIDATION_ERROR',
        code: '10001',
        detail: err ?? 'The data was invalid',
        location
      },
      HttpStatus.UNPROCESSABLE_ENTITY
    )
  }
}
