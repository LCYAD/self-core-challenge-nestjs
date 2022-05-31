import type { ValidationArguments, ValidationOptions } from 'class-validator'
import { registerDecorator } from 'class-validator'
import _ from 'lodash'

export const IsLaterThan = <T>(
  properties: { key: T | 'now'; laterInSecs?: number }[],
  validationOptions?: ValidationOptions
) => {
  return (object, propertyName: string) => {
    registerDecorator({
      name: 'IsLaterThan',
      target: object.constructor,
      propertyName,
      constraints: _.map(properties, 'key'),
      options: validationOptions,
      validator: {
        validate: (value: string, args: ValidationArguments) => {
          const relatedPropertyNames = args.constraints
          const propertiesObjByKey = _.keyBy(properties, 'key')
          return _.every(relatedPropertyNames, (name) => {
            const relatedValue: string =
              name === 'now' ? Date.now() : (args.object as any)[name]
            const laterInSecs: number = _.get(
              propertiesObjByKey,
              'key.laterInSecs',
              0
            )
            return (
              relatedValue &&
              new Date(value).getTime() >
                new Date(relatedValue).getTime() + laterInSecs
            )
          })
        },
        defaultMessage: (args: ValidationArguments) => {
          const relatedPropertyNames = args.constraints
          return `${propertyName} must be later than ${_.join(
            relatedPropertyNames,
            ', '
          )}`
        }
      }
    })
  }
}
