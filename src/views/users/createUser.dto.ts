import {
  IsString,
  IsEmail,
  IsOptional,
  IsDate,
} from 'class-validator';

class CreateArticleDto {
  @IsString()
  public username: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsOptional()
  @IsDate()
  public createdAt: Date;

  @IsOptional()
  @IsDate()
  public updatedAt: Date;
}

export default CreateArticleDto;
