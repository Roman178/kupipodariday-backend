import { IsNotEmpty, IsUrl, Length, MaxLength, Min } from 'class-validator';
export class CreateWishDto {
  @IsNotEmpty()
  @Length(1, 250)
  public name: string;

  @IsNotEmpty()
  @IsUrl()
  @MaxLength(200)
  public link: string;

  @IsNotEmpty()
  @IsUrl()
  public image: string;

  @IsNotEmpty()
  @Min(1)
  public price: number;

  @IsNotEmpty()
  public description: string;
}
