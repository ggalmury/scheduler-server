import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserToken extends BaseEntity {
  @PrimaryColumn({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  refreshToken: string;
}
