import {ExecutionContext, Injectable, SetMetadata} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";

export const Public = () => SetMetadata('isPublic', true);


@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }
    canActivate(
        context: ExecutionContext,
    ): Promise<boolean> | boolean | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true
        return super.canActivate(context);
    }
}