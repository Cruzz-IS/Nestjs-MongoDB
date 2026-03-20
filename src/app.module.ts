import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HelloController } from './hello/hello.controller';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [TasksModule, AuthModule, UsersModule, PostsModule],
  controllers: [HelloController],
})
export class AppModule {}
