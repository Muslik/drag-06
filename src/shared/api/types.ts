export interface Request {
  path: string;
  method: 'post' | 'get' | 'delete' | 'put' | 'patch';
  body?: Record<string, unknown>;
  query?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface Answer {
  ok: boolean;
  body: unknown;
  status: number;
  headers: Record<string, string>;
}

export interface FakeData {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
