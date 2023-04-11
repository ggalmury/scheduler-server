import { GoogleUser } from 'src/auth/entity/google.entity';
import { User } from 'src/auth/entity/user.entity';

export const TaskPrivacy = {
  public: 'public',
  private: 'private',
  relevant: 'relevant',
} as const;

export const TaskType = {
  basic: {
    type: 'basic',
    color: '#f1d39d',
  },
  work: {
    type: 'work',
    color: '#9799cd',
  },
  meeting: {
    type: 'meeting',
    color: '#eab3b6',
  },
  personal: {
    type: 'personal',
    color: '#ff9cadc1',
  },
} as const;

export const LoginPlatform = {
  default: 'default',
  google: 'google',
};

export type TaskPrivacyType = (typeof TaskPrivacy)[keyof typeof TaskPrivacy];
export type TaskTypeType = (typeof TaskType)[keyof typeof TaskType];
export type LoginPlatformType = (typeof LoginPlatform)[keyof typeof LoginPlatform];
export type UserPlatformType = User | GoogleUser | null;
