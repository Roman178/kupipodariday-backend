import { IsNotEmpty, IsOptional, NotEquals } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @NotEquals(0)
  public amount: number;

  @IsOptional()
  public hidden: boolean;

  @IsNotEmpty()
  public itemId: number;
}
