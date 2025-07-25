import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ConflictException extends BaseException {
  constructor(message: string, code: string, details?: string) {
    super(message, HttpStatus.CONFLICT, code, details);
  }
}
