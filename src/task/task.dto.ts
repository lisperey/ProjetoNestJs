import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class TaskDto {
  @IsUUID()
  @IsOptional()
  id: string;
  title: string;
  description: string;
  status: string;
  expirationDate: Date;
}

export interface FindAllParameters{
  title: string;
  status: string;
}

export enum TaskStatusEnum{
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  To_DO = "To_DO",
}

export class TaskRouteParameters{
  @IsUUID()
  id: string;
}
