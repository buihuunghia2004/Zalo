export interface PageOptionsDto {
  limit?: number;
  afterCursor?: number;
  beforeCursor?: number;
  q?: string;
}
export interface CursorPaginationDto {
  limit?: number;
  afterCursor?: number;
  beforeCursor?: number;
  totalRecords?: number;
}
export interface CursorPaginatedRes<TData> {
  data: TData[];
  pagination: CursorPaginationDto
}

export interface CursorPaginatedReq<TData> {
  data: TData;
  pagination: PageOptionsDto
}