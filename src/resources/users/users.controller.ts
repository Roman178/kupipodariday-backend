import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { User } from './entities/user.entity';
import { FindUsersDto } from './dto/find-users.dto';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('me')
  public findMe(@Req() req): Promise<User> {
    return this.usersService.findById(req.user.id, { withEmail: true });
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  public async findMyWishes(@Req() req): Promise<Wish[]> {
    return this.wishesService.findWishesByUserId(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  public async findUserWishes(
    @Param('username') username: string,
  ): Promise<Wish[]> {
    const user = await this.usersService.findByUsername(username);
    return this.wishesService.findWishesByUserId(user.id);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  public async updateMe(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    updateUserDto.password
      ? await this.usersService.updateWithPassword(req.user.id, updateUserDto)
      : await this.usersService.update(req.user.id, updateUserDto);

    return this.usersService.findById(req.user.id, { withEmail: true });
  }

  @Post('find')
  public async findMany(@Body() findUsersDto: FindUsersDto): Promise<User[]> {
    return this.usersService.findMany(findUsersDto);
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  public async findOne(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
