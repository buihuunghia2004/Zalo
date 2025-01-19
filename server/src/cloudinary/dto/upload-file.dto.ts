import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsNotEmpty()
  description: string; // Mô tả file

  @IsString()
  @IsOptional()
  category?: string; // Loại file (nếu có)
}
