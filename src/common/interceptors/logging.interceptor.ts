import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const userId = req.user?.id || 'anonymous';

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const delay = Date.now() - now;
          this.logger.log(
            `${method} ${url} ${response.statusCode} ${delay}ms - ${userId} ${ip} ${userAgent}`,
          );
        },
        error: (error) => {
          const response = context.switchToHttp().getResponse();
          const delay = Date.now() - now;
          this.logger.error(
            `${method} ${url} ${response.statusCode} ${delay}ms - ${userId} ${ip} ${userAgent}`,
            error.stack,
          );
        },
      }),
    );
  }
}
