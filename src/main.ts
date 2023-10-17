import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  await app.listen(3000);
  console.log(`************************ Current ENV = ${process.env.NODE_ENV}`)

}
bootstrap();
