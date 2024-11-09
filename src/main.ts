import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {ValidationPipe} from "@nestjs/common";
import {join} from "path";
import * as express from 'express';


async function bootstrap() {
    const app = await NestFactory.create(AppModule, {cors: true});

    const options = new DocumentBuilder()
        .setTitle('Your API Title')
        .setDescription('Your API description')
        .setVersion('1.0')
        .addServer('http://localhost:3000/', 'Local environment')
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            in: 'header',
            name: 'Authorization',
            description: 'Enter your Bearer token',
        })
        .addSecurityRequirements('bearer')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            skipNullProperties: true,
            skipMissingProperties: true,
            skipUndefinedProperties: true,
        })
    );

    app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

    await app.listen(process.env.PORT ?? 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
