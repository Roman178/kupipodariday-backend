import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/resources/users/users.service';

@Injectable()
export class JwtStartegy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwtSecret'),
    });
  }

  public async validate(jwtPayload: { sub: number }) {
    const user = await this.usersService.findById(jwtPayload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
