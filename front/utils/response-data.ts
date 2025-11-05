export interface BaseResponse<T> {
  data: T[];
  message: string;
  statusCode: number;
}

export interface SingleResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface PaginatinedResponse<T> extends BaseResponse<T> {
  meta?: {
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}