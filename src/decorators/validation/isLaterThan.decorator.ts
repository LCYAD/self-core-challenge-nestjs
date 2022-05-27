import type { ValidationArguments, ValidationOptions } from 'class-validator'
import { registerDecorator } from 'class-validator'

export const IsLaterThan = (
  property: string,
  validationOptions?: ValidationOptions
) => {
  return (object, propertyName: string) => {
    registerDecorator({
      name: 'IsLaterThan',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate: (value: string, args: ValidationArguments) => {
          const [relatedPropertyName] = args.constraints
          const relatedValue: string = (args.object as any)[relatedPropertyName]
          return new Date(value).getTime() > new Date(relatedValue).getTime()
        },
        defaultMessage: (args: ValidationArguments) => {
          const [relatedPropertyName] = args.constraints
          return `${propertyName} must be later than ${relatedPropertyName}`
        }
      }
    })
  }
}
