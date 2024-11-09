import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-local';
import {UserService} from "../user/user.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            usernameField: 'email',
        });
    }

    async validate(email: string, password: string) {
        const user = await this.userService.validateUser(email, password);

        if (!user) throw new UnauthorizedException({
            message: ['Unauthorized Credentials'],
            error: 'Unauthorized',
            statusCode: 401
        });

        return user;
    }
}