import { BaseEntity, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserToken extends BaseEntity {
  @OneToOne((type) => User)
  @JoinColumn({ name: 'email', referencedColumnName: 'email' })
  user: User;

  @Column({ type: 'varchar' })
  refreshToken: string;
}
