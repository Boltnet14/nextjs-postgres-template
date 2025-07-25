import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Connect to the database
  await prisma.$connect();
});

afterAll(async () => {
  // Clean up database between tests
  const models = Reflect.ownKeys(prisma).filter(
    (key) => key[0] !== '_' && key[0] !== '$',
  );

  // Only run in test environment
  if (process.env.NODE_ENV === 'test') {
    for (const modelKey of models) {
      await prisma[modelKey].deleteMany({});
    }
  }

  // Disconnect from the database
  await prisma.$disconnect();
});
