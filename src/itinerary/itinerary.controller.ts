import { Controller, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('itinerary')
export class ItineraryController {
  private readonly logger = new Logger(ItineraryController.name);
  
  constructor(private readonly itineraryService: ItineraryService) {}

  @Public()
  @Post('generate')
  async generateItinerary(
    @Body() data: {
      budget: number;
      location: string;
      numberOfDays: number;
    },
  ) {
    this.logger.log('Received generate itinerary request');
    this.logger.log('Request data:', data);
    return this.itineraryService.generateItinerary(
      data.budget,
      data.location,
      data.numberOfDays,
    );
  }
} 