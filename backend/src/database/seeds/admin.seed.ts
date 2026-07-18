import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../auth/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

dotenv.config();

/**
 * Creates the first admin user: `npm run seed`
 * Credentials come from ADMIN_USERNAME / ADMIN_PASSWORD in `.env`.
 */
async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'bakery',
    entities: [User, Product],
    synchronize: true,
  });

  await dataSource.initialize();

  const username = process.env.ADMIN_USERNAME ?? 'admin';
  const repo = dataSource.getRepository(User);
  const existing = await repo.findOne({ where: { username } });

  if (existing) {
    console.log(`ℹ️  Admin "${username}" already exists.`);
  } else {
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? 'admin123', 10);
    await repo.save(repo.create({ username, password }));
    console.log(`✅ Admin created: ${username}`);
  }

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
