import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compress from 'fastify-compress';
import { AppModule } from 'app.module';
import { VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: {
        prettyPrint: process.env.NODE_ENV === 'development',
      },
    }),
    { logger: ['error', 'warn'] },
  );

  // app.use(compression());
  app.enableCors({ origin: '*' });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.register(compress, { global: true });

  if (process.env.NODE_ENV === 'development') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Long Lost')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig, {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    });

    SwaggerModule.setup('docs', app, document);
  }

  const server = await app.listen(process.env.PORT, '0.0.0.0');
  server.setTimeout(1800000);
}

bootstrap();
