import { CommonEntityFields } from 'src/types/CommonEntityFields';
import { User } from 'src/resources/users/entities/user.entity';
import { Column, JoinColumn, ManyToOne, Entity, OneToMany } from 'typeorm';
import { Offer } from 'src/resources/offers/entities/offer.entity';
import { ColumnNumericTransformer } from 'src/helpers/ColumnNumericTransformer';
@Entity()
export class Wish extends CommonEntityFields {
  @Column()
  public name: string;

  @Column()
  public link: string;

  @Column()
  public image: string;

  @Column({
    scale: 2,
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
  })
  public price: number;

  @Column({
    scale: 2,
    default: 0,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  public raised: number;

  @Column()
  public description: string;

  @Column({ default: 0, nullable: true })
  public copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinColumn()
  public owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  public offers: Offer[];
}
