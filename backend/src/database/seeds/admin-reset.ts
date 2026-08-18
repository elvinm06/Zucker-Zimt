import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../auth/entities/user.entity';
import { typeOrmConfig } from '../typeorm.config';

dotenv.config();

/**
 * Resets the admin login: `npm run admin:reset`
 *
 * Deliberately separate from `admin.seed.ts`, which never touches an existing
 * user — a seed that silently overwrote credentials on every run would be a
 * footgun. This script exists for the two cases the seed cannot cover:
 * a forgotten password, and renaming the admin account.
 *
 * Both values are read from ADMIN_USERNAME / ADMIN_PASSWORD in `.env`, so the
 * password never has to be typed on the command line (where it would land in
 * the shell history).
 */
async function resetAdmin() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error('❌ ADMIN_USERNAME and ADMIN_PASSWORD must both be set in .env');
    process.exit(1);
  }

  const dataSource = new DataSource({
    ...(typeOrmConfig() as DataSourceOptions),
    synchronize: true,
  });

  await dataSource.initialize();
  const repo = dataSource.getRepository(User);

  const hash = await bcrypt.hash(password, 10);
  const match = await repo.findOne({ where: { username } });

  if (match) {
    match.password = hash;
    await repo.save(match);
    console.log(`✅ Password updated for "${username}".`);
  } else {
    // No user under that name: either the account was renamed in .env, or the
    // database is empty. Renaming is only safe when there is exactly one
    // account — with several, the script cannot know which one was meant.
    const all = await repo.find();

    if (all.length === 1) {
      const previous = all[0].username;
      all[0].username = username;
      all[0].password = hash;
      await repo.save(all[0]);
      console.log(`✅ Admin renamed "${previous}" → "${username}" and password updated.`);
    } else if (all.length === 0) {
      await repo.save(repo.create({ username, password: hash }));
      console.log(`✅ Admin created: ${username}`);
    } else {
      console.error(
        `❌ No user named "${username}", and ${all.length} accounts exist ` +
          `(${all.map((u) => u.username).join(', ')}). Set ADMIN_USERNAME to one of them.`,
      );
      process.exit(1);
    }
  }

  await dataSource.destroy();
}

resetAdmin().catch((err) => {
  console.error('❌ Reset failed:', err);
  process.exit(1);
});
