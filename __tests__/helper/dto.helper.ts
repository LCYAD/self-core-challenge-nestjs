/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import _ from 'lodash'

import config from '@config/index'

const classTransformOptions = {
  excludeExtraneousValues: true
}

export const testValid = (done) => (dtoSchema, testObj) => {
  const classObject = plainToInstance(dtoSchema, testObj, classTransformOptions)
  const errors = validateSync(classObject)
  if (errors.length) {
    done.fail(errors)
  } else {
    done()
  }
}

export const testInvalid = (done) => (dtoSchema, testObj) => {
  const classObject = plainToInstance(dtoSchema, testObj, classTransformOptions)
  const errors = validateSync(classObject, config().validatorOptions)
  if (errors.length) {
    expect(errors).toMatchSnapshot()
    done()
  } else {
    done.fail('the test should have failed')
  }
}

export const generateValidBaseTest = (dto, testExample) => {
  it('for validExample', (done) => {
    testValid(done)(dto, testExample)
  })
}

export const generateValidOptionalTest = (keys, dto, testExample) => {
  _.forEach(keys, (key) => {
    it(`for missing ${key}`, (done) => {
      testValid(done)(dto, _.omit(testExample, [key]))
    })
  })
}

export const generateValidDefaultValueTest = (
  tests: { key: string; defaultValue: any }[],
  dto,
  testExample
) => {
  _.forEach(tests, ({ key, defaultValue }) => {
    it(`for ${key} have a default value of ${defaultValue}`, (done) => {
      const parsedObject = instanceToPlain(
        plainToInstance(dto, _.omit(testExample, [key]), {
          enableImplicitConversion: true
        })
      )
      if (_.isEqual(parsedObject[key], defaultValue)) {
        done()
      } else {
        done.fail(
          `default value for ${key} is expected to be ${defaultValue} but got ${parsedObject[key]} instead`
        )
      }
    })
  })
}

export const generateValidOptionalIfFieldIsNullTest = (
  tests: { key: string; allowedKeys: string[] }[],
  dto,
  testExample
) => {
  _.forEach(tests, (test) => {
    it(`allow ${test.allowedKeys} missing when ${test.key} is null`, (done) => {
      test.allowedKeys.forEach((allowedKey) => {
        testValid(done)(dto, _.omit(testExample, [test.key, allowedKey]))
      })
    })
  })
}

export const generateValidEmptyArrayTest = (
  keys: string[],
  dto,
  testExample
) => {
  _.forEach(keys, (key) => {
    it(`for ${key} as an empty array`, (done) => {
      testValid(done)(dto, { ...testExample, [key]: [] })
    })
  })
}

export const generateMissingFieldTest = (keys: string[], dto, testExample) => {
  _.forEach(keys, (key) => {
    it(`for missing ${key}`, (done) => {
      testInvalid(done)(dto, _.omit(testExample, [key]))
    })
  })
}

export const generateInvalidNumberTest = (keys: string[], dto, testExample) => {
  _.forEach(keys, (key) => {
    it(`for ${key} not an number`, (done) => {
      testInvalid(done)(dto, { ...testExample, [key]: 'xxx' })
    })
  })
}

export const generateInvalidIntegerTest = (
  keys: string[],
  dto,
  testExample
) => {
  _.forEach(keys, (key) => {
    it(`for ${key} not an integer`, (done) => {
      testInvalid(done)(dto, { ...testExample, [key]: 111.1 })
    })
  })
}

export const generateInvalidIntegerArrayTest = (
  keys: string[],
  dto,
  testExample
) => {
  _.forEach(keys, (key) => {
    it(`for ${key} not an integer`, (done) => {
      testInvalid(done)(dto, { ...testExample, [key]: [111.1] })
    })
  })
}

export const generateInvalidDateTest = (keys: string[], dto, testExample) => {
  _.forEach(keys, (key) => {
    it(`for ${key} not an valid date`, (done) => {
      testInvalid(done)(dto, { ...testExample, [key]: 'invalid date' })
    })
  })
}

export const generateInvalidMongoIdTest = (
  keys: string[],
  dto,
  testExample
) => {
  _.forEach(keys, (key) => {
    it(`for ${key} as an invalid mongo Id`, (done) => {
      testInvalid(done)(dto, { ...testExample, [key]: 'xxx' })
    })
  })
}

export const generateInvalidMongoIdArrayTest = (
  keys: string[],
  dto,
  testExample
) => {
  _.forEach(keys, (key) => {
    it(`for ${key} with items in array that is an invalid mongo Id`, (done) => {
      testInvalid(done)(dto, { ...testExample, [key]: ['xxx'] })
    })
  })
}

export const generateInvalidEmptyStringTest = (
  keys: string[],
  dto,
  testExample
) => {
  _.forEach(keys, (key) => {
    it(`for ${key} being a empty string`, (done) => {
      testInvalid(done)(dto, {
        ...testExample,
        [key]: ''
      })
    })
  })
}

export const generateInvalidStringFormatTest = (
  tests: { key: string; invalidString: string }[],
  dto,
  testExample
) => {
  _.forEach(tests, (test) => {
    it(`for ${test.key} not a allowed value ${test.invalidString}`, (done) => {
      testInvalid(done)(dto, {
        ...testExample,
        [test.key]: test.invalidString
      })
    })
  })
}

export const generateInvalidStringFormatArrayTest = (
  tests: { key: string; invalidString: string }[],
  dto,
  testExample
) => {
  _.forEach(tests, (test) => {
    it(`for values in ${test.key} array not a allowed value ${test.invalidString}`, (done) => {
      testInvalid(done)(dto, {
        ...testExample,
        [test.key]: [test.invalidString]
      })
    })
  })
}

export const generateInvalidUrlTest = (keys: string[], dto, testExample) => {
  _.forEach(keys, (key) => {
    it(`for ${key} as an invalid url`, (done) => {
      testInvalid(done)(dto, { ...testExample, [key]: 'xxx' })
    })
  })
}

export const generateInvalidBase64Test = (keys: string[], dto, testExample) => {
  _.forEach(keys, (key) => {
    it(`for ${key} as an invalid base64`, (done) => {
      testInvalid(done)(dto, { ...testExample, [key]: 'xxx' })
    })
  })
}

export const generateInvalidEmailTest = (keys: string[], dto, testExample) => {
  _.forEach(keys, (key) => {
    it(`for ${key} as an invalid email`, (done) => {
      testInvalid(done)(dto, { ...testExample, [key]: 'xxx' })
    })
  })
}

export const generateInvalidArrayTest = (keys: string[], dto, testExample) => {
  _.forEach(keys, (key) => {
    it(`for ${key} not an array`, (done) => {
      testInvalid(done)(dto, { ...testExample, [key]: testExample[key][0] })
    })
  })
}

export const generateInvalidEmptyArrayTest = (
  keys: string[],
  dto,
  testExample
) => {
  _.forEach(keys, (key) => {
    it(`for ${key} as an empty array`, (done) => {
      testInvalid(done)(dto, { ...testExample, [key]: [] })
    })
  })
}

export const generateInvalidArrayNotUniqueTest = (
  keys: string[],
  dto,
  testExample
) => {
  _.forEach(keys, (key) => {
    it(`for ${key} not an array with unquie elements`, (done) => {
      testInvalid(done)(dto, {
        ...testExample,
        [key]: [testExample[key][0], testExample[key][0]]
      })
    })
  })
}

export const generateInvalidNestedObjectTest = (
  keys: string[],
  dto,
  testExample
) => {
  _.forEach(keys, (key) => {
    it(`for ${key} as an invalid nested object`, (done) => {
      testInvalid(done)(dto, { ...testExample, [key]: 'xxx' })
    })
  })
}

export const generateInvalidNestedObjectArrayTest = (
  keys: string[],
  dto,
  testExample
) => {
  _.forEach(keys, (key) => {
    it(`for invalid nested object inside array ${key}`, (done) => {
      testInvalid(done)(dto, { ...testExample, [key]: [{ test: 'xxx' }] })
    })
  })
}

export const generateDisallowedValueTest = (
  tests: { key: string; disallowedValue: any }[],
  dto,
  testExample,
  each = false
) => {
  _.forEach(tests, (test) => {
    it(`for ${test.key} not a allowed value ${test.disallowedValue}`, (done) => {
      testInvalid(done)(dto, {
        ...testExample,
        [test.key]: each ? [test.disallowedValue] : test.disallowedValue
      })
    })
  })
}

export const generateDisallowedValueInArrayTest = (
  tests: { key: string; disallowedValue: any }[],
  dto,
  testExample
) => {
  _.forEach(tests, (test) => {
    it(`for ${test.key} not a allowed value ${test.disallowedValue} within array`, (done) => {
      testInvalid(done)(dto, {
        ...testExample,
        [test.key]: [test.disallowedValue]
      })
    })
  })
}

export const generateInvalidArrayLargerThanMaxSizeTest = (
  tests: { key: string; allowedMaxSize: number; data: any }[],
  dto,
  testExample
) => {
  _.forEach(tests, (test) => {
    it(`for ${test.key} has more than ${test.allowedMaxSize} of items in array`, (done) => {
      testInvalid(done)(dto, {
        ...testExample,
        [test.key]: Array((test.allowedMaxSize as number) + 1).fill(test.data)
      })
    })
  })
}

export const generateInvalidArraySmallerThanMinSizeTest = (
  tests: { key: string; allowedMinSize: number; data: any }[],
  dto,
  testExample
) => {
  _.forEach(tests, (test) => {
    it(`for ${test.key} has less than ${test.allowedMinSize} of items in array`, (done) => {
      testInvalid(done)(dto, {
        ...testExample,
        [test.key]: Array(test.allowedMinSize - 1).fill(test.data)
      })
    })
  })
}

export const generateInvalidGreaterThanMaxNumberTest = (
  tests: { key: string; allowedMaxNumber: number }[],
  dto,
  testExample
) => {
  _.forEach(tests, (test) => {
    it(`for ${test.key} is greater than the maximum number ${test.allowedMaxNumber}`, (done) => {
      testInvalid(done)(dto, {
        ...testExample,
        [test.key]: (test.allowedMaxNumber as number) + 1
      })
    })
  })
}

export const generateInvalidSmallerThanMinNumberTest = (
  tests: { key: string; allowedMinNumber: any }[],
  dto,
  testExample
) => {
  _.forEach(tests, (test) => {
    it(`for ${test.key} is smaller than the minimum number ${test.allowedMinNumber}`, (done) => {
      testInvalid(done)(dto, {
        ...testExample,
        [test.key]: test.allowedMinNumber - 1
      })
    })
  })
}

export const generateInvalidMissingIfFieldHasTest = (
  tests: { key: string; disallowedKeys: string[] }[],
  dto,
  testExample
) => {
  _.forEach(tests, (test) => {
    it(`for ${test.key} is exists not allow ${test.disallowedKeys} is null `, (done) => {
      test.disallowedKeys.forEach((key) => {
        testInvalid(done)(dto, _.omit(testExample, [key]))
      })
    })
  })
}

export const generateDisallowedValueIfFieldSpecifiedValueTest = (
  tests: {
    specifiedObj: { key: string; value: string }
    disallowedObj: { key: string; value: string }
  }[],
  dto,
  testExample
) => {
  _.forEach(tests, (test) => {
    it(`for ${test.specifiedObj.key} is ${test.specifiedObj.value} not allow ${test.disallowedObj.key} is ${test.disallowedObj.value}  `, (done) => {
      testInvalid(done)(dto, {
        ...testExample,
        [test.specifiedObj.key]: test.specifiedObj.value,
        [test.disallowedObj.key]: test.disallowedObj.value
      })
    })
  })
}

export const mockInsertId = (dto, id) => ({ ...dto, _id: id })
