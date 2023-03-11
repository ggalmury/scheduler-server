export interface AccessPayload {
  uid: number;
  userName: string;
  email: string;
}

export interface RefreshPayload {
  uid: number;
  email: string;
}
