import { TaskColor, TaskPrivacy, TaskType } from 'src/enum/task-enum';
import { TaskTime } from 'src/interface/task-interface';
import { BaseEntity, BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedTodo } from '../../todo/entity/created-todo.entity';

@Entity()
export class CreatedTask extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  taskId: number;

  @Column({ type: 'int', nullable: false })
  uid: number;

  @Column({ type: 'varchar' })
  userName: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  color: TaskColor;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'json' })
  time: TaskTime;

  @Column({ type: 'varchar' })
  privacy: TaskPrivacy;

  @Column({ type: 'varchar' })
  type: TaskType;

  @Column({ type: 'date' })
  createdDt: Date;

  @Column({ type: 'boolean', default: false })
  state: boolean;

  @OneToMany(() => CreatedTodo, (todo) => todo.createdTask, { eager: true })
  createdTodo: CreatedTodo[];

  @BeforeInsert()
  setDefaultValues() {
    this.createdTodo = [];
  }
}
