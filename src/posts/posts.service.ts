import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepo: Repository<Post>,
  ) {}

  findFeed(): Promise<Post[]> {
    return this.postsRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  create(authorId: number, dto: CreatePostDto, mediaUrl?: string): Promise<Post> {
    const post = this.postsRepo.create({ content: dto.content, authorId, mediaUrl });
    return this.postsRepo.save(post);
  }

  async update(id: number, authorId: number, dto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    if (post.authorId !== authorId) throw new ForbiddenException();
    if (dto.content) post.content = dto.content;
    return this.postsRepo.save(post);
  }

  async remove(id: number, authorId: number): Promise<void> {
    const post = await this.findOne(id);
    if (post.authorId !== authorId) throw new ForbiddenException();
    await this.postsRepo.delete(id);
  }
}
