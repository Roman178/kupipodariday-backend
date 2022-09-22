import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/resources/users/entities/user.entity';
import { UsersService } from 'src/resources/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  public auth(user: User): { access_token: string } {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  public async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUsername(username, {
      withPassword: true,
    });
    // TODO: отдельный хэлпер или сервис по хэшированию пароля
    const passwordIsMatch = await bcrypt.compare(password, user.password);
    if (user && passwordIsMatch) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
