import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  private readonly errorCode: string;
  private readonly errorDetails: any;

  constructor(
    message: string,
    statusCode: HttpStatus,
    errorCode: string,
    details?: any,
  ) {
    super(
      {
        error: {
          code: errorCode,
          message: message,
          details: details || null,
        },
      },
      statusCode,
    );
    this.errorCode = errorCode;
    this.errorDetails = details;
  }

  getErrorCode(): string {
    return this.errorCode;
  }

  getErrorDetails(): any {
    return this.errorDetails;
  }
}
