import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedTask } from '../../task/entity/created-task.entity';

@Entity()
export class CreatedTodo extends BaseEntity {
  @PrimaryGeneratedColumn()
  todoId: number;

  @Column()
  uid: number;

  @Column()
  description: string;

  @Column({ type: 'varchar' })
  date: string;

  @ManyToOne(() => CreatedTask, (task) => task.createdTodo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId', referencedColumnName: 'taskId' })
  createdTask: CreatedTask;
}
