import { Test, TestingModule } from '@nestjs/testing'

import type { Response as LightMyRequestResponse } from 'light-my-request'
import _ from 'lodash'
import qs from 'qs'

import { GenericE2ETestModule } from './genericE2ETest.module'

interface MockGenericAppInterface {
  module?: {
    imports?: any[]
    controllers?: any[]
    providers?: any[]
  }
  overrideProviderCall?: any
}

export const mockGenericApp = async ({
  module,
  overrideProviderCall
}: MockGenericAppInterface) => {
  const moduleBuilder = Test.createTestingModule({
    imports: [GenericE2ETestModule.register(module)]
  })

  if (overrideProviderCall) {
    overrideProviderCall(moduleBuilder)
  }

  const compiledApp: TestingModule = await moduleBuilder.compile()
  return compiledApp
}

// used to solve array unintentionally gets converted to object with supertest
// Usage: stringifyUrl('http://test.com',{key:"value"}) return http://test.com?key=value
// Issue: https://stackoverflow.com/questions/31144739/array-unintentionally-gets-converted-to-object-with-supertest
export const stringifyUrl = (
  path: string,
  params: Record<string, unknown>
): string => {
  return `${path}?${qs.stringify(params)}`
}

export const generateSequentialTests = ({
  mockFunctionGroup,
  snapshots = [],
  notCalled = [],
  calledTimes = [],
  apiResponse
}: {
  mockFunctionGroup: {
    [key: string]: any
  }
  snapshots?: string[]
  notCalled?: string[]
  calledTimes?: { mockFunction: string; times: number }[]
  apiResponse: LightMyRequestResponse
}): void => {
  _.forEach(calledTimes, ({ mockFunction, times }) => {
    expect(_.get(mockFunctionGroup, mockFunction)).toBeCalledTimes(
      times as number
    )
  })
  _.forEach(snapshots, (mockFunction) => {
    expect(_.get(mockFunctionGroup, mockFunction)).toMatchSnapshot()
  })
  _.forEach(notCalled, (mockFunction) => {
    expect(_.get(mockFunctionGroup, mockFunction)).not.toBeCalled()
  })
  // for fastify inject test only, if it is express use body
  expect(apiResponse.json()).toMatchSnapshot()
}
