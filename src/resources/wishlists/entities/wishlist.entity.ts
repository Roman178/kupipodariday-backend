import { CommonEntityFields } from 'src/types/CommonEntityFields';
import { User } from 'src/resources/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Wish } from 'src/resources/wishes/entities/wish.entity';

@Entity()
export class Wishlist extends CommonEntityFields {
  @Column({ default: 'Мой вишлист', nullable: true })
  public name: string;

  @Column({ default: 'https://i.pravatar.cc/' })
  public image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  public owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  public items: Wish[];
}
