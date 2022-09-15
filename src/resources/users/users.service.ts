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

  public async findById(id: number, withPassword = false): Promise<User> {
    const user = await this._findUserWithOrWithoutPassword(
      withPassword,
      id,
      'id',
    );
    return user;
  }

  public async findByUsername(
    username: string,
    withPassword = false,
  ): Promise<User> {
    const user = await this._findUserWithOrWithoutPassword(
      withPassword,
      username,
      'username',
    );

    return user;
  }

  public update(id: number, updateUserDto: UpdateUserDto) {
    return 'update';
  }

  public remove(id: number) {
    return 'remove';
  }

  private _findUserWithOrWithoutPassword(
    withPassword: boolean,
    value: string | number,
    columnName: 'username' | 'id',
  ): Promise<User> {
    return withPassword
      ? this._usersRepository
          .createQueryBuilder()
          .select('user')
          .from(User, 'user')
          .where(`user.${columnName} = :${columnName}`, { [columnName]: value })
          .addSelect('user.password')
          .getOne()
      : this._usersRepository.findOneBy({ [columnName]: value });
  }
}
