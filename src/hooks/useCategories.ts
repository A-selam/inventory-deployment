import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
  type Category,
  type CreateCategoryRequest,
  type UpdateCategoryRequest,
} from "@/lib/categories";

const categoriesListKey = ["categories", "list"] as const;

export function useCategoriesList() {
  return useQuery<Category[]>({
    queryKey: categoriesListKey,
    queryFn: listCategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation<Category, unknown, CreateCategoryRequest>({
    mutationFn: (data) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory(id?: string) {
  const queryClient = useQueryClient();

  return useMutation<Category, unknown, UpdateCategoryRequest>({
    mutationFn: (data) => updateCategory(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string>({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
