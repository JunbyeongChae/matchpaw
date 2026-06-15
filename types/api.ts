export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type PaginatedData<T> = {
  items: T[];
  totalCount: number;
  pageNo: number;
  numOfRows: number;
};
