import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/resources/users/dto/create-user.dto';
import { UsersService } from 'src/resources/users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './local.guard';

@Controller('/')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _usersService: UsersService,
  ) {}

  @Post('signup')
  public async signup(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this._usersService.create(createUserDto);
      return this._authService.auth(user);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  public signin(@Req() req): { access_token: string } {
    return this._authService.auth(req.user);
  }
}
