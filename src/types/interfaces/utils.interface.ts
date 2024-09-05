export interface IPaginateOption {
  sortBy?: string;
  populate?: IPaginatePopulate[];
  limit?: number;
  page?: number;
}

interface IPaginatePopulate {
  path: string;
  select?: string;
  model?: string;
  populate?: { path: string; model?: string, select?: string, populate?: { path: string, model?: string, select?: string } };
  match?: any;
}
