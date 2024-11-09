import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {User} from "./entities/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {LocalStrategy} from "../strategy/local.strategy";
import {JwtStrategy} from "../strategy/jwt.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: 'JWT-KEY',
                signOptions: { expiresIn: '24h' }
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [UserController],
    providers: [UserService, LocalStrategy, JwtStrategy],
    exports: [UserService, JwtModule],
})
export class UserModule {}
