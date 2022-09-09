import { Length } from 'class-validator';
import { Content } from 'src/types';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class Wishlist extends Content {
  @Column()
  @Length(0, 250)
  public name: string;

  @Column()
  @Length(2, 30)
  public image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  public owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  public items: Wish[];
}
