import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class GenerateItineraryDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  budget: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  numberOfDays: number;
}
