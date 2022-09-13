import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(1, 64)
  public username: string;

  @IsOptional()
  @MaxLength(200)
  public about: string;

  @IsOptional()
  @IsUrl()
  public avatar: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  @MinLength(2)
  public password: string;
}
