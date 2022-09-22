import { CommonEntityFields } from 'src/types/CommonEntityFields';
import { User } from 'src/resources/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Wish } from 'src/resources/wishes/entities/wish.entity';
import { IsNotEmpty, IsOptional, IsUrl, Length } from 'class-validator';

@Entity()
export class Wishlist extends CommonEntityFields {
  @Column({ default: 'Мой вишлист', nullable: true })
  @Length(1, 250)
  @IsOptional()
  public name: string;

  @Column({ default: 'https://i.pravatar.cc/' })
  @IsUrl()
  @IsOptional()
  public image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  @IsNotEmpty()
  public owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  @IsOptional()
  public items: Wish[];
}
