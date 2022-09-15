import { CommonEntityFields } from 'src/types/CommonEntityFields';
import { User } from 'src/resources/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Wish } from 'src/resources/wishes/entities/wish.entity';

@Entity()
export class Offer extends CommonEntityFields {
  @Column({ scale: 2, type: 'decimal' })
  public amount: number;

  @Column()
  public hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  public user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  public item: Wish;
}
