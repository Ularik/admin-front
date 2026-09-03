export interface PagingParams {
    limit: number;
    offset: number;
  department_id?: string;
  from_date?: string;
  to_date?: string;
}

export interface ApiErrorResponse {
  detail: string;
}