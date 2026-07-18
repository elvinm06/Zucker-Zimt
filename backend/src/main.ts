import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { UPLOADS_DIR, ensureUploadsDir } from './uploads/uploads.config';

/** Local addresses a developer might open the site from. */
const LOCAL_ORIGIN =
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?$/;

/**
 * Builds the CORS check. A fixed origin string is too strict in development:
 * opening the site via 127.0.0.1 instead of localhost is a different origin,
 * and the browser then blocks every request with a bare "Failed to fetch".
 *
 * Outside production any local address is accepted; in production only the
 * origins listed in CORS_ORIGIN are.
 */
function buildCorsOrigin() {
  const allowed = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  const isProduction = process.env.NODE_ENV === 'production';

  return (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    // Same-origin requests, curl and native apps send no Origin header.
    if (!origin) return callback(null, true);
    if (allowed.includes(origin)) return callback(null, true);
    if (!isProduction && LOCAL_ORIGIN.test(origin)) return callback(null, true);

    return callback(null, false);
  };
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  // Uploaded images are served straight from disk at /uploads/<file>,
  // outside the "api" prefix.
  ensureUploadsDir();
  app.useStaticAssets(UPLOADS_DIR, { prefix: '/uploads/' });
  app.enableCors({
    origin: buildCorsOrigin(),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 4000);
  const port = process.env.PORT ?? 4000;
  console.log(`🍰 Bakery API:  http://localhost:${port}/api`);
  console.log(`📚 Swagger:     http://localhost:${port}/api/docs`);
}
bootstrap();
