import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ValidationException extends BaseException {
  constructor(details: Record<string, string>) {
    super(
      'Invalid request data.',
      HttpStatus.BAD_REQUEST,
      'VALIDATION_ERROR',
      details,
    );
  }
}
