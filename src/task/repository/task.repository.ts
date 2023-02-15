import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreatedTaskDto } from '../dto/task.dto';
import { CreatedTask } from '../entity/created-task.entity';

@Injectable()
export class TaskRepository extends Repository<CreatedTask> {
  private logger: Logger = new Logger(TaskRepository.name);
  constructor(private dataSource: DataSource) {
    super(CreatedTask, dataSource.createEntityManager());
  }

  async createTask(createdTaskDto: CreatedTaskDto): Promise<CreatedTask> {
    console.log(createdTaskDto);
    const { uid, userName, email, title, description, color, location, date, time, privacy } = createdTaskDto;

    try {
      const result = await this.create({
        uid,
        userName,
        email,
        title,
        description,
        color,
        location,
        date: new Date(date),
        time,
        privacy,
        createdDt: new Date(),
      }).save();

      return result;
    } catch (err) {
      this.logger.log(`DB error occurred(Task saving process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }
}
