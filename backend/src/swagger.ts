import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Mounts the API docs at /api/docs (JSON at /api/docs-json).
 *
 * Disabled when SWAGGER_ENABLED is explicitly "false" — the schema lists every
 * admin endpoint, which is fine locally but need not be public in production.
 */
export function setupSwagger(app: INestApplication) {
  if (process.env.SWAGGER_ENABLED === 'false') return;

  const config = new DocumentBuilder()
    .setTitle('Bakery API')
    .setDescription(
      [
        'Backend des Tortenkatalogs.',
        '',
        'Öffentliche Endpunkte liefern den Katalog für die Website.',
        'Alles unter „admin" erfordert einen JWT aus POST /auth/login:',
        'oben auf **Authorize** klicken und den Token einfügen.',
      ].join('\n'),
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token aus POST /auth/login',
      },
      // Name referenced by @ApiBearerAuth() on the controllers.
      'access-token',
    )
    .addTag('auth', 'Anmeldung des Administrators')
    .addTag('products', 'Katalog: öffentlich lesen, geschützt schreiben')
    .addTag('settings', 'Marke und Kontaktdaten')
    .addTag('uploads', 'Bild-Upload')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Bakery API',
    swaggerOptions: {
      // Keeps the entered token across page reloads.
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}
