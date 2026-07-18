import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

dotenv.config();

/**
 * Demo catalogue: `npm run seed:products`
 * Only inserts when the table is empty, so re-running creates no duplicates.
 */
const DEMO_PRODUCTS: Partial<Product>[] = [
  {
    name: 'Schwarzwälder Kirschtorte',
    description:
      'Luftiger Schokoladenbiskuit, Sauerkirschen und frisch geschlagene Sahne — das Original mit einem Hauch Kirschwasser.',
    price: 34.9,
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&q=80'],
    ingredients: ['Mehl', 'Kakao', 'Sahne', 'Eier', 'Zucker', 'Butter'],
    allergens: ['gluten', 'lactose', 'egg', 'cocoa', 'alcohol'],
  },
  {
    name: 'Klassische Sachertorte',
    description:
      'Dichte Schokoladenmasse mit feiner Aprikosenkonfitüre, überzogen mit dunkler Schokoladenglasur.',
    price: 32.5,
    images: ['https://images.unsplash.com/photo-1587314168485-3236d6710814?w=900&q=80'],
    ingredients: ['Mehl', 'Zartbitterschokolade', 'Butter', 'Eier', 'Zucker'],
    allergens: ['gluten', 'lactose', 'egg', 'cocoa'],
  },
  {
    name: 'Erdbeer-Sahnetorte',
    description:
      'Leichter Biskuit mit Vanillecreme und sonnengereiften Erdbeeren — unser Sommerliebling.',
    price: 29.9,
    images: ['https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=900&q=80'],
    ingredients: ['Mehl', 'Sahne', 'Erdbeeren', 'Eier', 'Vanille', 'Zucker'],
    allergens: ['gluten', 'lactose', 'egg'],
  },
  {
    name: 'Nussiger Honigkuchen',
    description:
      'Zehn hauchdünne Honigböden mit Sauerrahmcreme und gerösteten Haselnüssen.',
    price: 31.0,
    images: ['https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=900&q=80'],
    ingredients: ['Mehl', 'Sahne', 'Haselnüsse', 'Eier', 'Butter'],
    allergens: ['gluten', 'lactose', 'egg', 'nuts', 'honey'],
  },
  {
    name: 'Tiramisu-Torte',
    description:
      'Espressogetränkte Löffelbiskuits, luftige Mascarponecreme und eine feine Kakaohaube.',
    price: 33.5,
    images: ['https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=900&q=80'],
    ingredients: ['Mascarpone', 'Kaffee', 'Eier', 'Kakao', 'Zucker'],
    allergens: ['gluten', 'lactose', 'egg', 'cocoa'],
  },
  {
    name: 'Mandeltorte (glutenfrei)',
    description:
      'Saftige Torte auf Mandelmehlbasis mit Zitronenabrieb — ganz ohne Getreidemehl gebacken.',
    price: 35.9,
    images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&q=80'],
    ingredients: ['Mandelmehl', 'Eier', 'Zucker', 'Zitrone', 'Butter'],
    allergens: ['nuts', 'egg', 'lactose'],
  },
];

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
  const repo = dataSource.getRepository(Product);

  const existing = await repo.count();
  if (existing > 0) {
    console.log(`ℹ️  Catalogue already has ${existing} products — nothing added.`);
  } else {
    await repo.save(repo.create(DEMO_PRODUCTS));
    console.log(`✅ Inserted ${DEMO_PRODUCTS.length} demo products.`);
  }

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
