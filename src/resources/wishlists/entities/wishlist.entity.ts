import { Length } from 'class-validator';
import { Content } from 'src/types';
import { User } from 'src/resources/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Wish } from 'src/resources/wishes/entities/wish.entity';

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
