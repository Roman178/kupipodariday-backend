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
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

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

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }

  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
  ) {
    return this.offersService.update(+id, updateOfferDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return this.offersService.remove(+id);
  }
}
