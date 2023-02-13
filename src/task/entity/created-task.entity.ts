import { TaskPrivacy } from 'src/enum/task-enum';
import { TaskPeriod } from 'src/interface/task-interface';
import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CreatedTaskEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  taskId: number;

  @Column({ type: 'int' })
  uid: number;

  @Column({ type: 'varchar' })
  userName: string;

  @Column({ type: 'varchar', default: 'no title' })
  title: string;

  @Column({ type: 'varchar', default: 'no description' })
  description: string;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'json' })
  time: TaskPeriod;

  @Column({ type: 'varchar', default: TaskPrivacy.PUBLIC })
  privacy: TaskPrivacy;

  @Column({ type: 'date' })
  createdDt: Date;
}
