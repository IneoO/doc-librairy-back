import {
  IsString,
  IsEmail,
} from 'class-validator';

class CreateArticleDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

export default CreateArticleDto;
