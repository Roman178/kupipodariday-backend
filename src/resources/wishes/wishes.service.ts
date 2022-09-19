import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly _wishesRepository: Repository<Wish>,
  ) {}

  public async createWish(user: User, createWishDto: CreateWishDto) {
    const wish = await this._wishesRepository.save({
      ...createWishDto,
      owner: user,
    });
    return wish;
  }

  public async findOne(id: number) {
    const wish = await this._wishesRepository.findOne({
      relations: {
        owner: { wishes: true, wishlists: true, offers: true },
        offers: true,
      },
      where: { id },
    });
    if (!wish) {
      throw new NotFoundException();
    }

    return wish;
  }

  public async updateWish(
    id: number,
    updateWishDto: UpdateWishDto,
  ): Promise<any> {
    return await this._wishesRepository.update(id, updateWishDto);
  }

  public async findLast(): Promise<Wish[]> {
    return this._wishesRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  public async findTop(): Promise<Wish[]> {
    return this._wishesRepository.find({ take: 10, order: { copied: 'DESC' } });
  }

  public async remove(id: number): Promise<void> {
    await this._wishesRepository.delete(id);
  }

  public async findWishesByUserId(userId: number): Promise<Wish[]> {
    return this._wishesRepository.find({
      where: { owner: { id: userId } },
      relations: ['offers', 'owner'],
    });
  }

  findAll() {
    return `This action returns all wishes`;
  }
}
