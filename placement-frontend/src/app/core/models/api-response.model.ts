// This matches your backend's ApiResponse<T> wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}