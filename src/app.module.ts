import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from './config/config';
import { typeOrmConfig } from './config/typeorm.config';
import { TaskModule } from './task/task.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [ConfigurationModule, TypeOrmModule.forRoot(typeOrmConfig), AuthModule, TaskModule, TodoModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private datasource: DataSource) {}
}
