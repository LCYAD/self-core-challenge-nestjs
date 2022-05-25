import { HttpException, HttpStatus } from '@nestjs/common'

export class APIRouteNotFoundException extends HttpException {
  constructor(location = 'unknown', err = null) {
    super(
      {
        type: 'API_ROUTE_NOT_FOUND',
        code: '10401',
        detail: err ?? 'Request API route does not exist',
        location
      },
      HttpStatus.NOT_FOUND
    )
  }
}
