/* eslint-disable prettier/prettier */
export interface UserListParams {
  page?: number;
  limit?: number;

  search?: string;

  role?: string;
  status?: string;
  plan?: string;

  sort?: string;
  order?: "asc" | "desc";
}