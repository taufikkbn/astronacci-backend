import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserModule} from './user/user.module';
import {User} from "./user/entities/user.entity";
import {MulterModule} from "@nestjs/platform-express";
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from 'path';
import {ConfigModule} from "@nestjs/config";
import {APP_GUARD} from "@nestjs/core";
import {JwtGuard} from "./guard/jwt.guard";
import {JwtStrategy} from "./strategy/jwt.strategy";
import {UserService} from "./user/user.service";

@Module({
    imports: [
        UserModule,
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            password: '',
            username: 'taufikbarokahnur',
            entities: [
                User,
            ],
            database: 'astronacci',
            synchronize: true,
            logging: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'upload'), // Serve files from the upload directory
            serveRoot: '/uploads', // This is the URL path to access the files
        }),
        MulterModule.register({
            dest: './upload',
        }),
    ],
    controllers: [],
    providers: [
        UserModule,
        {
            provide: APP_GUARD,
            useClass: JwtGuard,
        },
        JwtStrategy,
    ],
})
export class AppModule {
}
