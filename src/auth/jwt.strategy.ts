import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/resources/users/users.service';

@Injectable()
export class JwtStartegy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get<string>('jwtSecret'),
    });
  }

  public async validate(jwtPayload: { sub: number }) {
    const user = await this._usersService.findById(jwtPayload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
