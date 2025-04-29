import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
