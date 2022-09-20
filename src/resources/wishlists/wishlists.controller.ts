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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Wishlist } from './entities/wishlist.entity';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Post()
  public async create(
    @Req() req,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    if (!createWishlistDto.image) delete createWishlistDto.image;
    if (!createWishlistDto.name) delete createWishlistDto.name;
    return this.wishlistsService.create(req.user, createWishlistDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  public async findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  public async findOne(@Param('id') id: string) {
    const wishlist = await this.wishlistsService.findOne(parseInt(id));
    if (!wishlist) {
      throw new NotFoundException();
    }
    return wishlist;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  public async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.wishlistsService.findOne(parseInt(id));
    if (!wishlist) {
      throw new NotFoundException();
    }
    if (wishlist.owner.id === req.user.id) {
      await this.wishlistsService.update(parseInt(id), updateWishlistDto);
      return;
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  public async remove(@Req() req, @Param('id') id: string) {
    const wishlist = await this.wishlistsService.findOne(parseInt(id));
    if (!wishlist) {
      throw new NotFoundException();
    }
    if (wishlist.owner.id === req.user.id) {
      await this.wishlistsService.remove(parseInt(id));
      return;
    } else {
      throw new ForbiddenException();
    }
  }
}
