import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // Don't transform if it's a file download or stream
        const response = context.switchToHttp().getResponse();
        const contentType = response.getHeader('Content-Type');
        if (contentType && !contentType.includes('application/json')) {
          return data;
        }

        // Don't transform if it's already an error response
        if (data && data.error) {
          return data;
        }

        // Don't wrap paginated responses that already have a data property
        if (data && data.data && data.meta) {
          return data;
        }

        // Don't wrap null responses (like for 204 No Content)
        if (data === null || data === undefined) {
          return data;
        }

        // Otherwise wrap the response in a data property
        return { data };
      }),
    );
  }
}
