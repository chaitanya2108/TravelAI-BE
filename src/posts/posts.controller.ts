import {
    Controller,
    Get,
    Post as HttpPost,
    Put,
    Delete,
    Body,
    Param,
    UploadedFile,
    UseInterceptors,
    HttpCode,
    ParseIntPipe,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { join } from 'path';
  import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
  import { PostsService } from './posts.service';
  import { CreatePostDto } from './dto/create-post.dto';
  import { UpdatePostDto } from './dto/update-post.dto';
  
  @ApiTags('posts')
  @Controller()
  export class PostsController {
    constructor(private readonly postsService: PostsService) {}
  
    // 1) Homepage: list feed
    @Get('feeds')
    getFeed() {
      return this.postsService.findFeed();
    }
  
    // 2) Create a post (with optional media)
    @HttpPost('post')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          content: { type: 'string' },
          media: { type: 'string', format: 'binary' },
        },
        required: ['content'],
      },
    })
    @UseInterceptors(
      FileInterceptor('media', {
        storage: diskStorage({
          destination: join(__dirname, '../../uploads'),
          filename: (_, file, cb) =>
            cb(null, `${Date.now()}-${file.originalname}`),
        }),
      }),
    )
    create(
      @Body() dto: CreatePostDto,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      const mediaUrl = file ? `/uploads/${file.filename}` : undefined;
      // TODO: replace hard-coded authorId with real user from JWT/session
      return this.postsService.create(1, dto, mediaUrl);
    }
  
    // 3) Get single post
    @Get('posts/:id')
    getOne(@Param('id', ParseIntPipe) id: number) {
      return this.postsService.findOne(id);
    }
  
    // 4) Update a post
    @Put('posts/:id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdatePostDto,
    ) {
      return this.postsService.update(id, 1, dto);
    }
  
    // 5) Delete a post
    @HttpCode(204)
    @Delete('posts/:id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.postsService.remove(id, 1);
    }
  }
      