import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AnySchema, Asserts, ValidationError } from 'yup';

// Pipe
@Injectable()
export class YupPipe<T, S extends AnySchema<T>> implements PipeTransform<T, Asserts<S>> {
  // Constructor
  constructor(private readonly schema: S) {}

  // Methods
  transform(value: T, metadata: ArgumentMetadata): Asserts<S> {
    try {
      return this.schema.validateSync(value, { abortEarly: false });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new BadRequestException(error.inner.map(err => ({
          path: err.path,
          type: err.type,
          errors: err.errors
        })));
      }
      console.log(error);
      throw error;
    }
  }
}
