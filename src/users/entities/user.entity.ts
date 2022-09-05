import { Content } from 'src/types';
import { Entity, Column } from 'typeorm';
import { IsDefined, IsEmail, Length } from 'class-validator';

@Entity()
export class User extends Content {
  @Column({ unique: true })
  @IsDefined()
  @Length(2, 30)
  public username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  public about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  public avatar: string;

  @Column({ unique: true })
  @IsEmail()
  public email: string;

  @Column()
  public password: string;
}
