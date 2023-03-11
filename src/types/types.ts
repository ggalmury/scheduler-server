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
};

export type Types<T> = T[keyof T];
