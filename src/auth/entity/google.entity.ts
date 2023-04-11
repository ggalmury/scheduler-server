import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GoogleUser extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  uid: number;

  @Index({ unique: true })
  @Column({ type: 'binary', length: 16 })
  uuid: Buffer;

  @Column({ type: 'varchar', default: 'user' })
  userName: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'date' })
  createdDt: Date;
}
