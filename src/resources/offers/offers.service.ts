import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
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
    private readonly _usersService: UsersService,
    private readonly _emailSenderService: EmailSenderService,
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
    const savedOffer = await this._offersRepository.save(offer);
    const updatedWish = await this._wishesService.findOne(
      createOfferDto.itemId,
    );
    if (updatedWish.raised === updatedWish.price) {
      const usersWithEmails = await this._usersService.findInIdsWithEmail(
        updatedWish.offers.map((offer) => offer.user.id),
      );
      await this._emailSenderService.sendEmail(
        updatedWish,
        usersWithEmails.map((user) => user.email),
      );
    }
    return savedOffer;
  }

  public async findAll(): Promise<Offer[]> {
    return this._offersRepository.find({ relations: ['item', 'user'] });
  }

  public async findOne(id: number): Promise<Offer> {
    return this._offersRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });
  }

  public async update(
    id: number,
    updateOfferDto: UpdateOfferDto,
  ): Promise<any> {
    return this._offersRepository.update(id, updateOfferDto);
  }

  public async remove(id: number): Promise<any> {
    return this._offersRepository.delete(id);
  }
}
