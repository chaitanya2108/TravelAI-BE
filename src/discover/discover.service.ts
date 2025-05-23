import { Injectable } from '@nestjs/common';
import { CreateDiscoverDto } from './dto/create-discover.dto';
import { UpdateDiscoverDto } from './dto/update-discover.dto';

@Injectable()
export class DiscoverService {
  create(createDiscoverDto: CreateDiscoverDto) {
    return 'This action adds a new discover';
  }

  findAll() {
    return `This action returns all discover`;
  }

  findOne(id: number) {
    return `This action returns a #${id} discover`;
  }

  update(id: number, updateDiscoverDto: UpdateDiscoverDto) {
    return `This action updates a #${id} discover`;
  }

  remove(id: number) {
    return `This action removes a #${id} discover`;
  }
}
