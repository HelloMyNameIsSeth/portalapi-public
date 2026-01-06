import { PrismaClient } from '@prisma/client';
import * as projectConfig from '../../config.json';

export default async function seedTokenTypes(prisma: PrismaClient) {
  const { token_types } = projectConfig;

  if (!token_types) {
    throw new Error('Wrong config.json');
  }

  await prisma.tokenType.createMany({
    data: token_types.map((tt) => ({
      name: tt,
    })),
  });
}
