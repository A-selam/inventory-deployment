import { apiClient } from "@/lib/api-client";

export type Category = {
  id: string;
  name: string;
  created_at: string;
  vendor_total: number;
};

export type CategorySortBy = "name" | "vendor_total";

export type CategorySortDir = "asc" | "desc";

type CategoriesListResponse = {
  success: boolean;
  message: string;
  data: Category[];
};

export async function listCategories(): Promise<Category[]> {
  const res = await apiClient.get("/categories");
  return (res.data as CategoriesListResponse).data;
}

export type CreateCategoryRequest = {
  name: string;
};

export async function createCategory(
  input: CreateCategoryRequest,
): Promise<Category> {
  const res = await apiClient.post("/categories", {
    name: input.name,
  });
  return res.data as Category;
}

export type UpdateCategoryRequest = {
  name: string;
};

export async function updateCategory(
  id: string,
  input: UpdateCategoryRequest,
): Promise<Category> {
  const res = await apiClient.patch(`/categories/${id}`, {
    name: input.name,
  });
  return res.data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}
