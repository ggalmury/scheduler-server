import { GoogleUser } from 'src/auth/entity/google.entity';
import { User } from 'src/auth/entity/user.entity';

export const LoginPlatform = {
  default: 'default',
  google: 'google',
};

export type LoginPlatformType = (typeof LoginPlatform)[keyof typeof LoginPlatform];
export type UserPlatformType = User | GoogleUser | null;
