import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { typeOrmConfig } from '../typeorm.config';

dotenv.config();

/**
 * Demo catalogue: `npm run seed:products`
 * Products already present (matched by name) are skipped, so the seed can be
 * re-run after new cakes are added to this list without creating duplicates.
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
  {
    name: 'Regenbogentorte',
    description:
      'Sechs bunte Biskuitböden unter zarter Vanillebuttercreme — beim Anschneiden gibt es Applaus.',
    price: 36.0,
    images: ['https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=900&q=80'],
    ingredients: ['Mehl', 'Zucker', 'Eier', 'Butter', 'Vanille'],
    allergens: ['gluten', 'lactose', 'egg'],
  },
  {
    name: 'Zitronen-Baiser-Tarte',
    description:
      'Mürbeteigboden, spritzige Zitronencreme und eine goldbraun flambierte Baiserhaube.',
    price: 28.5,
    images: ['https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=900&q=80'],
    ingredients: ['Mehl', 'Zitrone', 'Eier', 'Zucker', 'Butter'],
    allergens: ['gluten', 'lactose', 'egg'],
  },
  {
    name: 'Hochzeitstorte Blanc',
    description:
      'Dreistöckig, Vanillebiskuit mit weißer Ganache, dekoriert mit frischen Rosen. Nur auf Vorbestellung.',
    price: 129.0,
    images: ['https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=900&q=80'],
    ingredients: ['Mehl', 'Weiße Schokolade', 'Sahne', 'Eier', 'Vanille'],
    allergens: ['gluten', 'lactose', 'egg', 'soy'],
  },
  {
    name: 'Blaubeer-Schokoladentorte',
    description:
      'Dunkle Kakaoböden mit Blaubeerkompott und Frischkäsecreme — intensiv und trotzdem fruchtig.',
    price: 33.0,
    images: ['https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?w=900&q=80'],
    ingredients: ['Mehl', 'Kakao', 'Blaubeeren', 'Frischkäse', 'Eier', 'Zucker'],
    allergens: ['gluten', 'lactose', 'egg', 'cocoa'],
  },
  {
    name: 'Bunte Kindertorte',
    description:
      'Pastellfarbene Buttercreme auf weichem Vanillebiskuit — der Klassiker für jeden Kindergeburtstag.',
    price: 30.0,
    images: ['https://images.unsplash.com/photo-1552689486-f6773047d19f?w=900&q=80'],
    ingredients: ['Mehl', 'Zucker', 'Butter', 'Eier', 'Milch', 'Vanille'],
    allergens: ['gluten', 'lactose', 'egg'],
  },
  {
    name: 'Mango-Mousse-Torte',
    description:
      'Seidige Mangomousse unter glänzender Spiegelglasur, auf einem hauchdünnen Biskuitboden.',
    price: 37.5,
    images: ['https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=900&q=80'],
    ingredients: ['Mango', 'Sahne', 'Zucker', 'Eier', 'Mehl'],
    allergens: ['gluten', 'lactose', 'egg'],
  },
  {
    name: 'Macaron-Dripcake',
    description:
      'Hoher Biskuit in Rosé, weiße Schokoladenglasur im Drip-Look und handgemachte Macarons obenauf.',
    price: 42.0,
    images: ['https://images.unsplash.com/photo-1562440499-64c9a111f713?w=900&q=80'],
    ingredients: ['Mehl', 'Mandelmehl', 'Weiße Schokolade', 'Butter', 'Eier'],
    allergens: ['gluten', 'lactose', 'egg', 'nuts', 'soy'],
  },
  {
    name: 'Schokoladen-Ganache-Tarte',
    description:
      'Dunkle Ganache aus 70-prozentiger Schokolade auf knusprigem Boden, mit Pistazien und Orangenzeste.',
    price: 30.5,
    images: ['https://images.unsplash.com/photo-1626803775151-61d756612f97?w=900&q=80'],
    ingredients: ['Mehl', 'Zartbitterschokolade', 'Sahne', 'Butter', 'Pistazien'],
    allergens: ['gluten', 'lactose', 'cocoa', 'nuts'],
  },
  {
    name: 'Blaubeer-Käsekuchen',
    description:
      'Cremiger Käsekuchen auf Butterkeksboden, großzügig mit Blaubeeren aus dem Wald bedeckt.',
    price: 27.9,
    images: ['https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=900&q=80'],
    ingredients: ['Frischkäse', 'Butter', 'Eier', 'Zucker', 'Blaubeeren', 'Mehl'],
    allergens: ['gluten', 'lactose', 'egg'],
  },
  {
    name: 'Stracciatella-Cremetorte',
    description:
      'Zarte Sahnecreme zwischen luftigen Böden, durchzogen von feinen Schokoladenraspeln.',
    price: 32.0,
    images: ['https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=900&q=80'],
    ingredients: ['Mehl', 'Sahne', 'Zartbitterschokolade', 'Eier', 'Zucker'],
    allergens: ['gluten', 'lactose', 'egg', 'cocoa'],
  },
  {
    name: 'Brombeer-Vanilletorte',
    description:
      'Vanillebiskuit mit Mascarponecreme, frischen Brombeeren und essbaren Blüten.',
    price: 34.5,
    images: ['https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=900&q=80'],
    ingredients: ['Mehl', 'Mascarpone', 'Brombeeren', 'Eier', 'Vanille', 'Zucker'],
    allergens: ['gluten', 'lactose', 'egg'],
  },
  {
    name: 'Cookies-and-Cream-Partytorte',
    description:
      'Hohe Torte mit Schokokeksen, Vanillecreme und Zuckerstreuseln — der Hingucker auf jeder Feier.',
    price: 39.0,
    images: ['https://images.unsplash.com/photo-1616690710400-a16d146927c5?w=900&q=80'],
    ingredients: ['Mehl', 'Kakao', 'Butter', 'Zucker', 'Milch', 'Eier'],
    allergens: ['gluten', 'lactose', 'egg', 'cocoa', 'soy'],
  },
  {
    name: 'Schokoladen-Trüffeltorte',
    description:
      'Drei Schichten Schokoladenbiskuit mit Trüffelcreme, überzogen von warm gegossener Ganache.',
    price: 36.5,
    images: ['https://images.unsplash.com/photo-1602351447937-745cb720612f?w=900&q=80'],
    ingredients: ['Mehl', 'Zartbitterschokolade', 'Sahne', 'Butter', 'Eier'],
    allergens: ['gluten', 'lactose', 'egg', 'cocoa'],
  },
  {
    name: 'Himbeer-Cheesecake',
    description:
      'New-York-Style Cheesecake, cremig gebacken und mit warmem Himbeerspiegel serviert.',
    price: 28.9,
    images: ['https://images.unsplash.com/photo-1578775887804-699de7086ff9?w=900&q=80'],
    ingredients: ['Frischkäse', 'Butter', 'Eier', 'Zucker', 'Himbeeren', 'Mehl'],
    allergens: ['gluten', 'lactose', 'egg'],
  },
];

async function seed() {
  // See admin.seed.ts — shares the app's connection settings.
  const dataSource = new DataSource({
    ...(typeOrmConfig() as DataSourceOptions),
    synchronize: true,
  });

  await dataSource.initialize();
  const repo = dataSource.getRepository(Product);

  // Matching by name (rather than bailing out when the table is non-empty)
  // keeps the seed additive: new entries in DEMO_PRODUCTS land in a catalogue
  // that already has products, and re-runs stay idempotent.
  const known = new Set((await repo.find({ select: { name: true } })).map((p) => p.name));
  const missing = DEMO_PRODUCTS.filter((p) => !known.has(p.name as string));

  if (missing.length === 0) {
    console.log(`ℹ️  All ${DEMO_PRODUCTS.length} demo products are already in the catalogue — nothing added.`);
  } else {
    await repo.save(repo.create(missing));
    console.log(`✅ Inserted ${missing.length} demo products (${known.size} were already there).`);
  }

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
