export interface IPaginateOption {
  sortBy?: string;
  populate?: IPaginatePopulate[];
  limit?: number;
  page?: number;
}

export interface IPaginatePopulate {
  path: string;
  select?: string;
  model?: string;
  populate?: IPaginatePopulate;
  match?: any;
}
