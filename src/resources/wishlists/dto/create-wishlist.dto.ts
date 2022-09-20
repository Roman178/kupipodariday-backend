import { IsOptional, IsUrl, Length, ValidateIf } from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  @IsOptional()
  @ValidateIf((value) => !!value.name)
  public name: string;

  @IsUrl()
  @IsOptional()
  @ValidateIf((value) => !!value.image)
  public image: string;

  @IsOptional()
  public itemsId: number[];
}
