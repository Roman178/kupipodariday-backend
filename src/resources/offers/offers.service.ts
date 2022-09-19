import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly _offersRepository: Repository<Offer>,
    private readonly _wishesService: WishesService,
  ) {}

  public async createOffer(
    user: User,
    createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const wish = await this._wishesService.findOne(createOfferDto.itemId);
    if (user.id === wish.owner.id) {
      throw new BadRequestException('Нельзя скидываться себе на подарки');
    }
    if (wish.raised + createOfferDto.amount > wish.price) {
      throw new BadRequestException(
        'Предложена большая сумма. Уменьшите сумму.',
      );
    }
    await this._wishesService.updateWish(wish.id, {
      raised: wish.raised + createOfferDto.amount,
    });
    const offer = this._offersRepository.create({
      ...createOfferDto,
      user,
      item: wish,
    });
    return this._offersRepository.save(offer);
  }

  public async findAll() {
    return this._offersRepository.find({ relations: ['item', 'user'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} offer`;
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    return `This action updates a #${id} offer`;
  }

  async remove(id: number) {
    return this._offersRepository.delete(id);
  }
}
