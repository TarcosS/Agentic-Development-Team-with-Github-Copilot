import instance from "./instance";

export interface HealthResponse {
  status: string;
}

export interface MessageResponse {
  message: string;
  timestamp: string;
}

export const api = {
  getHealth: () => instance.get<HealthResponse>("/health"),
  getMessage: () => instance.get<MessageResponse>("/api/message"),
};
