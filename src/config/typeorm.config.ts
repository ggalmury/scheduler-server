import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GoogleUser } from 'src/auth/entity/google.entity';
import { UserToken } from 'src/auth/entity/token.entity';
import { User } from 'src/auth/entity/user.entity';
import { CreatedTask } from 'src/task/entity/created-task.entity';
import { CreatedTodo } from 'src/todo/entity/created-todo.entity';
import SnakeNamingStrategy from 'typeorm-naming-strategy';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [User, GoogleUser, UserToken, CreatedTask, CreatedTodo],
};
