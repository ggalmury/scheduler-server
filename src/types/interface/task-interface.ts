export interface TaskTimeDetail {
  hour: number;
  minute: number;
}

export interface TaskTime {
  startAt: TaskTimeDetail;
  endAt: TaskTimeDetail;
}

export interface DateMatrix {
  dateMatrix: { x: number; y: number };
}
