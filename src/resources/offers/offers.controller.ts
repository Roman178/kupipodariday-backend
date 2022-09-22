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
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Offer } from './entities/offer.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  public async create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.createOffer(req.user, createOfferDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  public findAll() {
    return this.offersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Offer> {
    const offer = await this.offersService.findOne(parseInt(id));
    if (!offer) {
      throw new NotFoundException();
    }
    return offer;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  public async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
  ) {
    const offer = await this.offersService.findOne(parseInt(id));
    if (!offer) {
      throw new NotFoundException();
    }
    if (offer.user.id === req.user.id) {
      await this.offersService.update(parseInt(id), updateOfferDto);
      return;
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  public async remove(@Req() req, @Param('id') id: string) {
    const offer = await this.offersService.findOne(parseInt(id));
    if (!offer) {
      throw new NotFoundException();
    }
    if (offer.user.id === req.user.id) {
      await this.offersService.remove(parseInt(id));
      return;
    } else {
      throw new ForbiddenException();
    }
  }
}
