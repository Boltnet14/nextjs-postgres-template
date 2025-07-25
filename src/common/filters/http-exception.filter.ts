import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from '../exceptions/base.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: any = {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        details: 'An unexpected error occurred. Please try again later.',
      },
    };

    // Handle known HTTP exceptions
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Handle our custom exceptions
      if (exception instanceof BaseException) {
        responseBody = exceptionResponse;
      } else {
        // Handle NestJS built-in exceptions
        if (typeof exceptionResponse === 'object') {
          const errorResponse = exceptionResponse as any;
          responseBody = {
            error: {
              code: errorResponse.error || 'HTTP_ERROR',
              message: errorResponse.message || exception.message,
              details: Array.isArray(errorResponse.message)
                ? errorResponse.message
                : null,
            },
          };
        } else {
          responseBody = {
            error: {
              code: 'HTTP_ERROR',
              message: exception.message,
              details: null,
            },
          };
        }
      }
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${statusCode}`,
      exception instanceof Error ? exception.stack : 'Unknown error',
    );

    // Send the response
    response.status(statusCode).json(responseBody);
  }
}
