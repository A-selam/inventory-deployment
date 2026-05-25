import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
  type CategoriesListQuery,
  type CategoriesListResponse,
  type CategoryResponse,
  type CreateCategoryRequest,
  type UpdateCategoryRequest,
} from "@/lib/categories";

const categoriesListKey = (params?: CategoriesListQuery) =>
  ["categories", "list", params ?? {}] as const;
const categoryDetailKey = (id: string) => ["categories", "detail", id] as const;

export function useCategoriesList(params: CategoriesListQuery) {
  return useQuery<CategoriesListResponse>({
    queryKey: categoriesListKey(params),
    queryFn: () => listCategories(params),
  });
}

export function useCategory(id?: string) {
  return useQuery<CategoryResponse>({
    queryKey: categoryDetailKey(id ?? ""),
    queryFn: () => getCategory(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) =>
      updateCategory(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
