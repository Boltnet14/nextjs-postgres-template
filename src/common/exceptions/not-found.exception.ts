import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  constructor(resource: string, id: string, details?: string) {
    super(
      `${resource} with ID ${id} not found.`,
      HttpStatus.NOT_FOUND,
      `${resource.toUpperCase()}_NOT_FOUND`,
      details ||
        `The requested ${resource.toLowerCase()} does not exist or has been deleted.`,
    );
  }
}
