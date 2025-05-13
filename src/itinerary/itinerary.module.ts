import { Module } from '@nestjs/common';
import { ItineraryController } from './itinerary.controller';
import { ItineraryService } from './itinerary.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [ItineraryController],
  providers: [ItineraryService],
})
export class ItineraryModule {} 