export interface PagingParams {
    limit: number;
    offset: number;
  department_id?: string;
}

export interface ApiErrorResponse {
  detail: string;
}