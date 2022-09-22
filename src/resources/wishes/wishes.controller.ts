import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('top')
  public async findTop(): Promise<Wish[]> {
    const topWishes = await this.wishesService.findTop();
    return topWishes;
  }

  @Get('last')
  public async findLast(): Promise<Wish[]> {
    const lastWishes = await this.wishesService.findLast();
    return lastWishes;
  }

  @UseGuards(JwtGuard)
  @Post()
  public create(
    @Req() req,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    return this.wishesService.create(req.user, createWishDto);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Wish> {
    const wish = await this.wishesService.findOne(parseInt(id));
    if (!wish) {
      throw new NotFoundException();
    }
    return wish;
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  public async copyWishToMe(@Req() req, @Param('id') id: string): Promise<any> {
    const wish = await this.wishesService.findOne(parseInt(id));
    await this.wishesService.updateWish(wish.id, { copied: ++wish.copied });
    if (wish.owner.id !== req.user.id) {
      const { name, link, image, price, description } = wish;
      await this.wishesService.create(req.user, {
        name,
        link,
        image,
        price,
        description,
      });
    }
    return {};
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  public async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<void> {
    const wish = await this.wishesService.findOne(parseInt(id));
    if (wish.owner.id === req.user.id) {
      await this.wishesService.updateWish(parseInt(id), updateWishDto);
      return;
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  public async remove(@Req() req, @Param('id') id: string): Promise<Wish> {
    const wish = await this.wishesService.findOne(parseInt(id));
    if (wish.owner.id === req.user.id) {
      await this.wishesService.remove(parseInt(id));
      return wish;
    } else {
      throw new ForbiddenException();
    }
  }
}
