export interface PaginationRes {
  limit: number;
  afterCursor: number;
  beforeCursor: number;
  totalRecords: number;
}
export interface ApiResHasPagination<T> {
  data: T;
  pagination: PaginationRes; 
}