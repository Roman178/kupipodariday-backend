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
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const passwordHash = await bcrypt.hash(createUserDto.password, 10);
      const user = this.usersRepository.create({
        ...createUserDto,
        password: passwordHash,
      });
      const savedUser = await this.usersRepository.save(user);
      console.log(user);
      console.log(savedUser);
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
      return this.findUserAddUnselectedFields(id, 'id', {
        withEmail,
        withPassword,
      });
    } else {
      return this.usersRepository.findOneBy({ id });
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
      return this.findUserAddUnselectedFields(username, 'username', {
        withEmail,
        withPassword,
      });
    } else {
      return this.usersRepository.findOneBy({ username });
    }
  }

  public async findMany({ query }: FindUsersDto): Promise<User[]> {
    const users = await this.usersRepository.find({
      where: [{ email: query }, { username: query }],
    });
    return users;
  }

  public async findInIdsWithEmail(ids: number[]): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.id IN (:...ids)', { ids })
      .addSelect('user.email')
      .getMany();
  }

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    return this.usersRepository.update(id, updateUserDto);
  }

  public async updateWithPassword(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<any> {
    const passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    return await this.usersRepository.update(id, {
      ...updateUserDto,
      password: passwordHash,
    });
  }

  private async findUserAddUnselectedFields(
    value: string | number,
    columnName: 'username' | 'id',
    options: { withPassword: boolean; withEmail: boolean },
  ): Promise<User> {
    let queryBuilder = this.usersRepository
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
