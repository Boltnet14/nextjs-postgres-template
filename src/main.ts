import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  //Get configuration from environment variables
  const configService = app.get('ConfigService');
  const port = configService.get('PORT');
  const apiPrefix = configService.get('API_PREFIX');
  const environment = configService.get('NODE_ENV');

  // Set global prefix for API routes
  app.setGlobalPrefix(apiPrefix);

  // Enable CORS
  app.enableCors({
    origin:
      environment === 'production'
        ? ['https://directafrica.com', /\.directafrica\.com$/]
        : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Apply middleware
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  //Apply global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable shutdown hooks
  app.enableShutdownHooks();

  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(
    `Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
  logger.log(`Environment: ${environment}`);
}

bootstrap().catch((err) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application', err);
  process.exit(1);
});
