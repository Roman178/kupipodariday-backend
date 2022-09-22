import { CommonEntityFields } from 'src/types/CommonEntityFields';
import { User } from 'src/resources/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Wish } from 'src/resources/wishes/entities/wish.entity';
import { ColumnNumericTransformer } from 'src/helpers/ColumnNumericTransformer';
import { IsNotEmpty, IsOptional, NotEquals } from 'class-validator';

@Entity()
export class Offer extends CommonEntityFields {
  @Column({
    scale: 2,
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
  })
  @IsNotEmpty()
  @NotEquals(0)
  public amount: number;

  @Column({ default: false })
  @IsOptional()
  public hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  @IsNotEmpty()
  public user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  @IsNotEmpty()
  public item: Wish;
}
