import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Datasource URL is taken from environment variables.
    // Do not hardcode database credentials in source files.
    // In production, set `HEROKU_POSTGRESQL_GRAY_URL` or `DATABASE_URL` in your environment.
    super({
      datasources: {
        db: {
          url: process.env.HEROKU_POSTGRESQL_GRAY_URL || process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
