import { PrismaClient } from '@prisma/client';
import { add, sub } from 'date-fns';

export default async function seedRaffles(prisma: PrismaClient) {
  const currentDate = new Date();
  //   const tokenTypes = await prisma.tokenType.findMany();

  await prisma.raffle.create({
    data: {
      id: 1,
      name: 'Past Raffle',
      active: false,
      endDate: sub(currentDate, { hours: 1 }),
      tokenTypes: {
        createMany: {
          data: [
            {
              tokenTypeId: 1,
            },
            {
              tokenTypeId: 2,
            },
            {
              tokenTypeId: 3,
            },
            {
              tokenTypeId: 4,
            },
            {
              tokenTypeId: 5,
            },
            {
              tokenTypeId: 6,
            },
          ],
        },
      },
    },
  });

  await prisma.raffle.create({
    data: {
      id: 2,
      name: 'Future Raffle',
      active: true,
      endDate: add(currentDate, { hours: 2 }),
      tokenTypes: {
        createMany: {
          data: [
            {
              tokenTypeId: 1,
            },
            {
              tokenTypeId: 2,
            },
            {
              tokenTypeId: 3,
            },
            {
              tokenTypeId: 4,
            },
            {
              tokenTypeId: 5,
            },
            {
              tokenTypeId: 6,
            },
          ],
        },
      },
    },
  });
}
