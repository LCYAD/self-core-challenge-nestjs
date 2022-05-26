import type { ValidationError } from 'class-validator'
import { compact, flatten, forEach, get, isEmpty, map, isString } from 'lodash'
import { ValidationException } from '../exceptions/validation.exception'

const generateErrorMsg = (errors: ValidationError, initial = ''): any[] => {
  return map(errors, (error) => {
    if (!error.contraints && !isEmpty(get(error, 'children', []))) {
      return {
        path: `${initial}${get(error, 'property')}`,
        children: generateErrorMsg(error.children)
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
        handleChildren(child.children, newPath)
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
          return generateErrorMsg(e, `${index}.`)
        })
      )
    )
  } else {
    errorMsg = generateErrorMsg(err)
  }

  return transformErrorMsg(errorMsg)
}

export const validationExceptionFactory = (
  errors: string | ValidationError[]
) => {
  throw new ValidationException(
    'Validation Pipe',
    isString(errors) ? errors : getErrorMsg(errors)
  )
}
