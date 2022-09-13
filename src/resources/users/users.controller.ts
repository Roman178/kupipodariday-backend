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

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  // @Post()
  // public create(@Body() createUserDto: CreateUserDto) {
  //   return this._usersService.create(createUserDto);
  // }
  @UseGuards(JwtGuard)
  @Get('me')
  public findMe(@Req() req) {
    return this._usersService.findById(req.user.id);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    const user = await this._usersService.findById(Number(id));
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Patch(':id')
  public update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this._usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  public remove(@Param('id') id: string) {
    return this._usersService.remove(+id);
  }
}
