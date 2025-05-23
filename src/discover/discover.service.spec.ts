import { Test, TestingModule } from '@nestjs/testing';
import { DiscoverService } from './discover.service';

describe('DiscoverService', () => {
  let service: DiscoverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscoverService],
    }).compile();

    service = module.get<DiscoverService>(DiscoverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
