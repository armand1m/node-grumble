export interface NodeGrumbleOptions {
  url: string;
  port: number;
  rejectUnauthorized?: boolean;
  name?: string;
  password?: string;
  tokens?: any[];
}
