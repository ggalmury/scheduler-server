import { TaskColor, TaskPrivacy, TaskType } from 'src/enum/task-enum';
import { TaskTime } from 'src/interface/task-interface';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'varchar', default: 'no title' })
  title: string;

  @Column({ type: 'varchar', default: 'no description' })
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
}
