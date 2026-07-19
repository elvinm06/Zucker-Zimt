import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { User } from '../auth/entities/user.entity';
import { Settings } from '../settings/entities/settings.entity';

/**
 * Central database configuration, read from `.env`.
 * If DATABASE_URL is set it takes priority (managed hosts like Railway,
 * Render, Heroku give a single connection string); otherwise the
 * individual DB_* variables are used.
 * DB_SYNCHRONIZE should only be true in development —
 * use migrations in production.
 */
export const typeOrmConfig = (): TypeOrmModuleOptions => {
  const common = {
    type: 'postgres' as const,
    entities: [Product, User, Settings],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.NODE_ENV !== 'production',
  };

  if (process.env.DATABASE_URL) {
    return {
      ...common,
      url: process.env.DATABASE_URL,
    };
  }

  return {
    ...common,
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'bakery',
  };
};
