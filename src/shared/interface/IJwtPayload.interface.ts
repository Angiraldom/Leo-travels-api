export interface IJwtPayload {
  _id: string;
  email: string;
  rol: string;
  ipAddress: string;
  agent: string;
  exp?: number;
}
