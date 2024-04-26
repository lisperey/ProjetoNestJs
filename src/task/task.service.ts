import { TaskEntity } from './../db/entities/task.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindAllParameters, TaskDto, TaskStatusEnum } from './task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>
  ){
    
  }

  async create(task: TaskDto){
    const taskToSave: TaskEntity = {
      title: task.title,
      description: task.description,
      expirationDate: task.expirationDate,
      status: TaskStatusEnum.To_DO
    }
    const createdTask = await this.taskRepository.save(taskToSave);
    return this.mapEntityToDto(createdTask);
  }

  async findById(id: string): Promise<TaskDto> {
    const foundTask = await this.taskRepository.findOne({where: {id}})
    
    if (!foundTask) {
      throw new NotFoundException(`Task with ${id} not found`);
    }

    return this.mapEntityToDto(foundTask);
    
  }

  async update(id:string, task: TaskDto){
    const foundTask = await this.taskRepository.findOne({where: {id}})

    if (!foundTask) {
      throw new HttpException(
        `Task with id ${task.id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.taskRepository.update(id, this.mapDtoToEntity(task));
  }

  async delete(id: string) {
    const deleteTask = await this.taskRepository.delete(id);

    if (!deleteTask.affected) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
  
  }

  async findAll(params: FindAllParameters): Promise<TaskDto[]>{
    const searchParams: FindOptionsWhere<TaskEntity> = {}

    if(params.title){
      searchParams.title = Like(`%${params.title}%`)
    };
    if(params.status){
      searchParams.status = Like(`%${params.status}%`)
    };

    const foundtasks =  await this.taskRepository.find({
      where: searchParams
    });

    return foundtasks.map((taskEntity)=>this.mapEntityToDto(taskEntity));

  }

  private mapEntityToDto(taskEntity: TaskEntity): TaskDto{
    return{
      id: taskEntity.id,
      title: taskEntity.title,
      description: taskEntity.description,
      expirationDate: taskEntity.expirationDate,
      status: TaskStatusEnum[taskEntity.status]
    }
  }

  private mapDtoToEntity(taskDto: TaskDto): Partial<TaskEntity>{
    return{
      title: taskDto.title,
      description: taskDto.description,
      expirationDate: taskDto.expirationDate,
      status: taskDto.status.toString()
    }
  }
}
