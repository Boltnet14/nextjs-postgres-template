import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ForbiddenException extends BaseException {
  constructor(
    message: string,
    code = 'INSUFFICIENT_PERMISSIONS',
    details?: string,
  ) {
    super(
      message,
      HttpStatus.FORBIDDEN,
      code,
      details || 'You do not have permission to access this resource.',
    );
  }
}
