export interface RateLimit {
  apiRateLimit?: Partial<{
    reservoir: number;
    reservoirRefreshInterval: number;
    reservoirRefreshAmount: number;
    maxConcurrent: number;
  }>;
}
export interface ResMessage {
  message: string;
}
