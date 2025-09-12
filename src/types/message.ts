export type Message = {
  success: boolean;
  message: string;
  type?: "info" | "success" | "error";
  redirect?: string;
  duration?: number;
};