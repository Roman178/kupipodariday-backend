import { CommonEntityFields } from 'src/types/CommonEntityFields';
import { User } from 'src/resources/users/entities/user.entity';
import { Column, JoinColumn, ManyToOne, Entity, OneToMany } from 'typeorm';
import { Offer } from 'src/resources/offers/entities/offer.entity';
import { ColumnNumericTransformer } from 'src/helpers/ColumnNumericTransformer';
import {
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
@Entity()
export class Wish extends CommonEntityFields {
  @Column()
  @IsNotEmpty()
  @Length(1, 250)
  public name: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(200)
  public link: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  public image: string;

  @Column({
    scale: 2,
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
  })
  @IsNotEmpty()
  @Min(1)
  public price: number;

  @Column({
    scale: 2,
    default: 0,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  @IsOptional()
  public raised: number;

  @Column()
  @IsNotEmpty()
  public description: string;

  @Column({ default: 0, nullable: true })
  @IsOptional()
  public copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinColumn()
  @IsNotEmpty()
  public owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  @IsEmpty()
  public offers: Offer[];
}
