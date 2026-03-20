import { Module } from '@nestjs/common';
import { TaskController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { DatabaseModule } from 'src/database/database.module';
import { tasksProviders } from './tasks.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [TaskController],
  providers: [TasksService,
    ...tasksProviders,
  ],
})
export class TasksModule {}
