import { BaseEntity, Binary, Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserToken extends BaseEntity {
  @Index({ unique: true })
  @PrimaryColumn({ type: 'binary', length: 16 })
  uuid: Buffer;

  @Column({ type: 'text' })
  refreshToken: string;
}
