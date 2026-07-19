import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../auth/entities/user.entity';
import { typeOrmConfig } from '../typeorm.config';

dotenv.config();

/**
 * Creates the first admin user: `npm run seed`
 * Credentials come from ADMIN_USERNAME / ADMIN_PASSWORD in `.env`.
 */
async function seed() {
  // Reuses the app's connection settings so DATABASE_URL and DB_SSL work
  // here too — the seed is often run against a remote database.
  // synchronize is forced on: the seed must be able to create the tables
  // it writes into on a fresh database.
  const dataSource = new DataSource({
    ...(typeOrmConfig() as DataSourceOptions),
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
