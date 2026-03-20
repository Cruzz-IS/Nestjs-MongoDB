import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ITask } from './interfaces/task.interface';
import { Model } from 'mongoose';

export interface User {
  name: string;
  age: number;
}

export interface Task {
  id: number;
}

@Injectable()
export class TasksService {
  constructor(
    @Inject('TASK_MODEL')
    private taskModel: Model<ITask>,
  ) {}

  getTasks(): Promise<ITask[]> {
    return this.taskModel.find().exec();
  }

  async getTask(id: number): Promise<ITask> {
    const taskFound = await this.taskModel.findById(id).exec();

    if (!taskFound) {
      throw new NotFoundException(`Tarea con el id ${id} no existe`);
    }

    return taskFound;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<ITask> {
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  updateTask(task: UpdateTaskDto) {
    console.log(task);
    return 'actualizando tareas';
  }

  deleteTask() {
    return 'Eliminando Tarea';
  }

  updateTaskStatus() {
    return 'actualizando el estado de una tarea';
  }
}
