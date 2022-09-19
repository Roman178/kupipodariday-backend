import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ErrorCodesEnum } from 'src/types/ErrorCodesEnum';
import { FindUsersDto } from './dto/find-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly _usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const passwordHash = await bcrypt.hash(createUserDto.password, 10);
      const user = this._usersRepository.create({
        ...createUserDto,
        password: passwordHash,
      });
      await this._usersRepository.save(user);
      return user;
    } catch (error) {
      if (error.code === ErrorCodesEnum.DUPLICATE_KEY) {
        throw new ConflictException(error.detail);
      }
      throw new InternalServerErrorException(error?.message);
    }
  }

  public async findById(
    id: number,
    {
      withPassword = false,
      withEmail = false,
    }: { withPassword?: boolean; withEmail?: boolean } = {},
  ): Promise<User> {
    if (withPassword || withEmail) {
      return this._findUserAddUnselectedFields(id, 'id', {
        withEmail,
        withPassword,
      });
    } else {
      return this._usersRepository.findOneBy({ id });
    }
  }

  public async findByUsername(
    username: string,
    {
      withPassword = false,
      withEmail = false,
    }: { withPassword?: boolean; withEmail?: boolean } = {},
  ): Promise<User> {
    if (withPassword || withEmail) {
      return this._findUserAddUnselectedFields(username, 'username', {
        withEmail,
        withPassword,
      });
    } else {
      return this._usersRepository.findOneBy({ username });
    }
  }

  public async findMany({ query }: FindUsersDto): Promise<User[]> {
    const users = await this._usersRepository.find({
      where: [{ email: query }, { username: query }],
    });
    return users;
  }

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    return await this._usersRepository.update(id, updateUserDto);
  }

  public async updateWithPassword(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<any> {
    const passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    return await this._usersRepository.update(id, {
      ...updateUserDto,
      password: passwordHash,
    });
  }

  private async _findUserAddUnselectedFields(
    value: string | number,
    columnName: 'username' | 'id',
    options: { withPassword: boolean; withEmail: boolean },
  ): Promise<User> {
    let queryBuilder = this._usersRepository
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where(`user.${columnName} = :${columnName}`, { [columnName]: value });

    if (options.withPassword) {
      queryBuilder = queryBuilder.addSelect('user.password');
    }
    if (options.withEmail) {
      queryBuilder = queryBuilder.addSelect('user.email');
    }
    return queryBuilder.getOne();
  }
}
