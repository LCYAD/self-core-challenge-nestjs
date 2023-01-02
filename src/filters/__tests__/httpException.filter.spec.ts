import { NotFoundException, UnauthorizedException } from '@nestjs/common'

import type { Logger } from 'nestjs-pino'

import { HttpExceptionFilter } from '../httpException.filter'

const mockSwitchToHttp = (spyFunction) => {
  const fn = () => ({
    send: spyFunction,
    status: fn,
    getResponse: fn,
    getRequest: jest.fn(() => 'request success')
  })
  return fn
}

describe('HttpExceptionFilter', () => {
  let mockArgumentsHost
  let mockLoggerService
  let mockSendCall
  let httpExceptionFilter
  beforeEach(() => {
    mockSendCall = jest.fn()
    mockArgumentsHost = {
      getArgs: jest.fn(() => []),
      getArgsByIndex: jest.fn(),
      switchToRpc: () => ({
        getData: jest.fn()
      }),
      switchToHttp: mockSwitchToHttp(mockSendCall),
      switchToWs: () => ({
        getData: jest.fn(),
        getClient: jest.fn()
      })
    }

    mockLoggerService = {
      error: jest.fn()
    }

    httpExceptionFilter = new HttpExceptionFilter(mockLoggerService as Logger)
  })
  describe('catch', () => {
    it('should throw API_ROUTE_NOT_FOUND if NotFoundException is passed in', () => {
      httpExceptionFilter.catch(new NotFoundException(), mockArgumentsHost)
      expect(mockLoggerService.error).toHaveBeenCalledWith(
        'API_ROUTE_NOT_FOUND',
        {
          detail: 'Request API route does not exist',
          location: 'unknown',
          stackTrace: null
        }
      )
      expect(mockSendCall).toHaveBeenCalledWith({
        code: '10001',
        detail: 'Request API route does not exist',
        type: 'API_ROUTE_NOT_FOUND'
      })
    })
    it('should throw UNAUTHORIZED if UnauthorizedException is provided', () => {
      httpExceptionFilter.catch(new UnauthorizedException(), mockArgumentsHost)
      expect(mockLoggerService.error).toHaveBeenCalledWith('UNAUTHORIZED', {
        detail: 'authorization token was not valid',
        location: 'unknown',
        stackTrace: null
      })
      expect(mockSendCall).toHaveBeenCalledWith({
        code: '10002',
        detail: 'authorization token was not valid',
        type: 'UNAUTHORIZED'
      })
    })
  })
})
