import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get('user/:userId')
  getPostsByUser(@Param('userId') userId: string) {
    return this.postsService.getPostsByUser(userId);
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPost(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removePost(@Param('id') id: string) {
    return this.postsService.removePost(id);
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string, 
    @Body() updatePostDto: UpdatePostDto
  ) {
    return this.postsService.updatePost(id, updatePostDto);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postsService.update(+id, updatePostDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.postsService.remove(+id);
  // }
}
