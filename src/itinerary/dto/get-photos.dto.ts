import { IsString } from 'class-validator';

export class GetPhotosDto {
  @IsString()
  country: string;
}
