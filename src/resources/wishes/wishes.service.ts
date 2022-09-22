import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  public async create(user: User, createWishDto: CreateWishDto) {
    const wish = await this.wishesRepository.save({
      ...createWishDto,
      owner: user,
    });
    return wish;
  }

  public async findOne(id: number) {
    const wish = await this.wishesRepository.findOne({
      relations: {
        owner: { wishes: true, wishlists: true, offers: true },
        offers: { user: true },
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
    return await this.wishesRepository.update(id, updateWishDto);
  }

  public async findLast(): Promise<Wish[]> {
    return this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  public async findTop(): Promise<Wish[]> {
    return this.wishesRepository.find({ take: 10, order: { copied: 'DESC' } });
  }

  public async remove(id: number): Promise<void> {
    await this.wishesRepository.delete(id);
  }

  public async findWishesByUserId(userId: number): Promise<Wish[]> {
    return this.wishesRepository.find({
      where: { owner: { id: userId } },
      relations: ['offers', 'owner'],
    });
  }

  public async find(options: FindManyOptions<Wish>): Promise<Wish[]> {
    return this.wishesRepository.find(options);
  }
}
