import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000, () =>
    console.log(`Nest Application start on port ${process.env.PORT || 3000}`),
  );
}
bootstrap();