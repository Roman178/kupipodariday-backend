import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/resources/users/dto/create-user.dto';
import { UsersService } from 'src/resources/users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './local.guard';

@Controller('/')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  public async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.authService.auth(user);
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  public signin(@Req() req): { access_token: string } {
    return this.authService.auth(req.user);
  }
}
