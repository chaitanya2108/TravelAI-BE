import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { Public } from '../auth/decorators/public.decorator';
import { GenerateItineraryDto } from './dto/generate-itinerary.dto';
import { GetPhotosDto } from './dto/get-photos.dto';

@Controller('itinerary')
export class ItineraryController {
  private readonly logger = new Logger(ItineraryController.name);

  constructor(private readonly itineraryService: ItineraryService) {}

  @Public()
  @Post('generate')
  async generateItinerary(@Body() dto: GenerateItineraryDto) {
    this.logger.log('Received generate itinerary request');
    this.logger.log('Request data:', dto);
    return this.itineraryService.generateItinerary(
      dto.budget,
      dto.location,
      dto.numberOfDays,
    );
  }

  @Public()
  @Post('photos')
  async getCountryPhotos(@Body() dto: GetPhotosDto) {
    this.logger.log('Received get photos request');
    this.logger.log('Request data:', dto);
    return this.itineraryService.getCountryPhotos(dto.country);
  }
}
