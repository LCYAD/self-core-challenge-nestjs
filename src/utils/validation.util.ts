import { ValidationError } from 'class-validator'
import { compact, flatten, forEach, get, isEmpty, map } from 'lodash'

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

const transformErrorMsg = (errMsg: any[]) => {
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

export const getErrorMsg = (err, arrResponse = false): any[] => {
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
