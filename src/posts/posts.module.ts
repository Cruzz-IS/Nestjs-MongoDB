import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { postsProviders } from './posts.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PostsController],
  providers: [PostsService, ...postsProviders],
})
export class PostsModule {}
