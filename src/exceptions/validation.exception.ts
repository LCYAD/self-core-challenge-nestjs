import { HttpException, HttpStatus } from '@nestjs/common'

export class ValidationException extends HttpException {
  constructor(location = 'unknown', err = null) {
    super(
      {
        title: 'Validation Failed!',
        type: 'ValidationError',
        errorCode: '10100',
        message: 'The data was invalid',
        location,
        err
      },
      HttpStatus.UNPROCESSABLE_ENTITY
    )
  }
}
