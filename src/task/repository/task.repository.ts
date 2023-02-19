import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreatedTaskDto } from '../dto/create-task.dto';
import { SearchTaskDto } from '../dto/search-task.dto';
import { CreatedTask } from '../entity/created-task.entity';

@Injectable()
export class TaskRepository extends Repository<CreatedTask> {
  private logger: Logger = new Logger(TaskRepository.name);
  constructor(private dataSource: DataSource) {
    super(CreatedTask, dataSource.createEntityManager());
  }

  async createTask(createdTaskDto: CreatedTaskDto): Promise<CreatedTask> {
    const { uid, userName, email, title, description, color, location, date, time, privacy, type } = createdTaskDto;

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
        type,
        createdDt: new Date(),
      }).save();

      this.logger.log(`Task successfully created: ${email}`);

      return result;
    } catch (err) {
      this.logger.log(`DB error occurred(Task saving process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }

  async getTask(searchTaskDto: SearchTaskDto): Promise<CreatedTask[]> {
    const { uid, email } = searchTaskDto;
    try {
      const result: CreatedTask[] = await this.findBy({ uid, email });

      return result;
    } catch (err) {
      console.log(err);
      this.logger.log(`DB error occurred(Task searching process): ${email}`);
      throw new InternalServerErrorException('DB error occurred');
    }
  }
}
