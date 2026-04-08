import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HelloController } from './hello/hello.controller';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigService esté disponible en todos los módulos
      envFilePath: '.env',
    }),
    TasksModule,
    AuthModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [HelloController],
})
export class AppModule {}
