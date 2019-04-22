import {
  IsString,
  IsFQDN,
  IsUrl,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsBoolean,
  IsOptional,
  IsInt,
  IsDate,
} from 'class-validator';

class CreateArticleDto {
  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsString()
  @IsFQDN()
  public source: string;

  @IsString()
  public type: string;

  @IsString()
  @IsUrl()
  public url: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  public tags: string[];

  @IsBoolean()
  public valid: boolean;

  @IsOptional()
  @IsString()
  public posterEmail: string;

  @IsOptional()
  @IsInt()
  public nbClick: number;

  @IsOptional()
  @IsString()
  public validedBy: number;

  @IsOptional()
  @IsDate()
  public createdAt: Date;

  @IsOptional()
  @IsDate()
  public updatedAt: Date;
}

export default CreateArticleDto;
