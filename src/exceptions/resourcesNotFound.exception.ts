import { HttpException, HttpStatus } from '@nestjs/common'

export class ResourcesNotFoundException extends HttpException {
  constructor(location = 'unknown', err = null) {
    super(
      {
        type: 'RESOURCES_NOT_FOUND',
        code: '10004',
        detail: err ?? 'The requested resources is not found',
        location
      },
      HttpStatus.NOT_FOUND
    )
  }
}
