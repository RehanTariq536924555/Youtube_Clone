import { IsNotEmpty, IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Handle can only contain letters, numbers, underscores, and hyphens',
  })
  handle: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
