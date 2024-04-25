import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindAllParameters, TaskDto } from './task.dto';

@Injectable()
export class TaskService {
  private tasks: TaskDto[] = [];

  create(task: TaskDto){
    this.tasks.push(task);
    return;
  }

  findById(id: string): TaskDto {
    const task = this.tasks.find((r) => r.id === id);
    if (task) {
      return task;
    }
    
    throw new NotFoundException(`Task with ${id} not found`);
  }

  update(task: TaskDto){
    const taskIndex = this.tasks.findIndex((r) => r.id === task.id);

    if (taskIndex >= 0) {
      this.tasks[taskIndex] = task;
      return;
    }
    throw new HttpException(
      `Task with id ${task.id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  delete(id: string) {
    const taskIndex = this.tasks.findIndex((r) => r.id === id);

    if (taskIndex >= 0) {
      this.tasks.splice(taskIndex, 1);
      return { mensagem: `${id} deletado com sucesso` };
    }

    throw new HttpException(
      `Task with id ${id} not found`,
      HttpStatus.BAD_REQUEST,
    );

  }

  findAll(params: FindAllParameters): TaskDto[]{
    return this.tasks.filter((r) => {
      let match = true;
      if (params.title !== undefined && !r.title.includes(params.title)) {
        match = false;
      }
      if (params.status !== undefined && !r.status.includes(params.status)) {
        match = false;
      }
      return match;
    })

  }
}
