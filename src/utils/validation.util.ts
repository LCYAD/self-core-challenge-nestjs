import type { ValidationError } from 'class-validator'
import { compact, flatten, forEach, get, isEmpty, isString, map } from 'lodash'

import { ValidationException } from '@exceptions/validation.exception'

const generateErrorMsg = (errors: ValidationError, initial = ''): any[] => {
  return map(errors, (error) => {
    if (!error.contraints && !isEmpty(get(error, 'children', []))) {
      return {
        path: `${initial}${get(error, 'property')}`,
        children: generateErrorMsg(error.children as ValidationError)
      }
    }
    const constraints = get(error, 'constraints', null)
    return {
      path: `${initial}${get(error, 'property')}`,
      msg: constraints ? JSON.stringify(constraints) : 'error unknown',
      value: get(error, 'value')
    }
  })
}

const transformErrorMsg = (errMsg: ValidationError[]) => {
  const result = []
  const handleChildren = (children, currentPath = '') => {
    forEach(children, (child) => {
      const newPath =
        currentPath === '' ? child.path : `${currentPath}.${child.path}`
      if (child.msg) {
        result.push({
          path: newPath,
          msg: child.msg,
          value: child.value
        })
      } else {
        handleChildren(child.children, newPath as string)
      }
    })
  }
  handleChildren(errMsg)
  return result
}

const getErrorMsg = (err, arrResponse = false): ValidationError[] => {
  let errorMsg
  if (arrResponse) {
    errorMsg = flatten(
      compact(
        map(err, (e, index) => {
          if (isEmpty(e)) {
            return null
          }
          return generateErrorMsg(e as ValidationError, `${index}.`)
        })
      )
    )
  } else {
    errorMsg = generateErrorMsg(err as ValidationError)
  }

  return transformErrorMsg(errorMsg as ValidationError[])
}

export const getValidationExceptionFactory =
  ({ isArray = false, location }: { isArray?: boolean; location: string }) =>
  (errors: string | ValidationError[]) => {
    throw new ValidationException(
      location,
      isString(errors) ? errors : getErrorMsg(errors, isArray)
    )
  }
