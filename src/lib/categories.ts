import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse, PaginatedResult } from "@/types/api";

export type Category = {
  id: string;
  name: string;
  created_at: string;
  vendor_total: number;
  is_active: boolean;
};

export type CategoriesListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
};

export type CategoriesListResponse = ApiSuccessResponse<
  PaginatedResult<Category>
>;

export type CategoryResponse = ApiSuccessResponse<Category>;

export type CreateCategoryRequest = {
  name: string;
  is_active?: boolean;
};

export type UpdateCategoryRequest = {
  name?: string;
  is_active?: boolean;
};

export type DeleteCategoryResponse = ApiSuccessResponse<null>;

export async function listCategories(
  params: CategoriesListQuery,
): Promise<CategoriesListResponse> {
  const res = await apiClient.get("/categories", { params });
  return res.data as CategoriesListResponse;
}

export async function getCategory(id: string): Promise<CategoryResponse> {
  const res = await apiClient.get(`/categories/${id}`);
  return res.data as CategoryResponse;
}

export async function createCategory(
  data: CreateCategoryRequest,
): Promise<CategoryResponse> {
  const res = await apiClient.post("/categories", data);
  return res.data as CategoryResponse;
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryRequest,
): Promise<CategoryResponse> {
  const res = await apiClient.patch(`/categories/${id}`, data);
  return res.data as CategoryResponse;
}

export async function deleteCategory(
  id: string,
): Promise<DeleteCategoryResponse> {
  const res = await apiClient.delete(`/categories/${id}`);
  return res.data as DeleteCategoryResponse;
}
