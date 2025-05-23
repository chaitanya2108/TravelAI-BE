import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiscoverService } from './discover.service';
import { CreateDiscoverDto } from './dto/create-discover.dto';
import { UpdateDiscoverDto } from './dto/update-discover.dto';

@Controller('discover')
export class DiscoverController {
  constructor(private readonly discoverService: DiscoverService) {}

  @Post()
  create(@Body() createDiscoverDto: CreateDiscoverDto) {
    return this.discoverService.create(createDiscoverDto);
  }

  @Get()
  findAll() {
    return this.discoverService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discoverService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscoverDto: UpdateDiscoverDto) {
    return this.discoverService.update(+id, updateDiscoverDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discoverService.remove(+id);
  }
}
