import { IsString, IsOptional, IsEnum, IsNotEmpty, IsArray, IsNumber, IsBoolean } from 'class-validator';
import { VideoVisibility } from '../entities/video.entity';
import { Transform } from 'class-transformer';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(VideoVisibility)
  @IsOptional()
  visibility?: VideoVisibility;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(tag => tag.trim());
    }
    return value;
  })
  tags?: string[];

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  duration?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isShort?: boolean;
}