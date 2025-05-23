import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscoverDto } from './create-discover.dto';

export class UpdateDiscoverDto extends PartialType(CreateDiscoverDto) {}
