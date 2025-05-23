import { Module } from '@nestjs/common';
import { DiscoverService } from './discover.service';
import { DiscoverController } from './discover.controller';

@Module({
  controllers: [DiscoverController],
  providers: [DiscoverService],
})
export class DiscoverModule {}
