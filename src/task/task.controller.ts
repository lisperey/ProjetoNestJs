import { TaskService } from './task.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { FindAllParameters, TaskDto, TaskRouteParameters } from './task.dto';
import { log } from 'console';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Post()
  async create(@Body() task: TaskDto){
    await this.taskService.create(task);
  }

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<TaskDto>{
    return this.taskService.findById(id);
  }
  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<TaskDto[]> {
    return this.taskService.findAll(params);
  }

  @Put('/:id')
  async update(@Param() params: TaskRouteParameters, @Body() task: TaskDto){
    await this.taskService.update(params.id, task);
  }

  @Delete('/:id')
  delete(@Param('id') id:string){
    return this.taskService.delete(id);
  }
}

