import { TaskTime } from 'src/types/interface/task-interface';
import { BaseEntity, BeforeInsert, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedTodo } from '../../todo/entity/created-todo.entity';

@Entity()
export class CreatedTask extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  taskId: number;

  @Column({ type: 'binary', length: 16 })
  uuid: Buffer;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  color: string;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'varchar' })
  date: string;

  @Column({ type: 'json' })
  time: TaskTime;

  @Column({ type: 'varchar' })
  privacy: string;

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
