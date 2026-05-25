export type ApiError = {
  code: string;
  message: string;
};

export type ApiErrorResponse = {
  success: false;
  error: ApiError;
};

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type PaginatedResult<T> = {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  data: T[];
};
