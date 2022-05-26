import type { PipeTransform } from '@nestjs/common'
import { Injectable } from '@nestjs/common'

import type { ClassConstructor } from 'class-transformer'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import type { ValidationError } from 'class-validator'
import { validateSync } from 'class-validator'
import _ from 'lodash'

// The reason not to use ParseArrayPipe in @nestjs/common is because
// exceptionFactory is called each time there is an error so could not get the whole error message
@Injectable()
export class ArrayValidationPipe implements PipeTransform {
  constructor(
    private readonly classType: ClassConstructor<unknown>,
    private readonly exceptionFactory: (
      errors: string | ValidationError[]
    ) => void
  ) {}

  transform(values: unknown[]) {
    if (!Array.isArray(values)) {
      void this.exceptionFactory('request data is not an array type')
    } else {
      const classObject = plainToInstance(this.classType, values, {
        excludeExtraneousValues: true
      })
      const errors: ValidationError[] = _.map(classObject, (objectElement) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        validateSync(objectElement)
      )
      if (_.some(errors, (error) => error.length !== 0)) {
        void this.exceptionFactory(errors)
      }
      return _.map(instanceToPlain(classObject), (obj) =>
        _.omitBy(obj, _.isUndefined)
      )
    }
  }
}
