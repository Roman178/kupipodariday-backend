import { Content } from 'src/types';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Offer extends Content {
  @Column({ scale: 2, type: 'decimal' })
  public amount: number;

  @Column()
  public hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  public user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  public item: Wish;
}
