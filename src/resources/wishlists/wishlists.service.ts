import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly _wishlistsRepository: Repository<Wishlist>,
    private readonly _wishesService: WishesService,
  ) {}

  public async create(user: User, createWishlistDto: CreateWishlistDto) {
    const wishes = await this._wishesService.find({
      where: { id: In(createWishlistDto.itemsId || []) },
    });
    const wishlist = this._wishlistsRepository.create({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });
    return this._wishlistsRepository.save(wishlist);
  }

  public async findAll(): Promise<Wishlist[]> {
    return this._wishlistsRepository.find({ relations: ['items', 'owner'] });
  }

  public async findOne(id: number): Promise<Wishlist> {
    return this._wishlistsRepository.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });
  }

  public async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<any> {
    return this._wishlistsRepository.update(id, updateWishlistDto);
  }

  public async remove(id: number): Promise<any> {
    return this._wishlistsRepository.delete(id);
  }
}
