import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createVendor,
  deleteVendor,
  getVendor,
  listVendors,
  updateVendor,
  type CreateVendorRequest,
  type UpdateVendorRequest,
  type VendorResponse,
  type VendorsListQuery,
  type VendorsListResponse,
} from "@/lib/vendors";

const vendorsListKey = (params?: VendorsListQuery) =>
  ["vendors", "list", params ?? {}] as const;
const vendorDetailKey = (id: string) => ["vendors", "detail", id] as const;

export function useVendorsList(params: VendorsListQuery) {
  return useQuery<VendorsListResponse>({
    queryKey: vendorsListKey(params),
    queryFn: () => listVendors(params),
  });
}

export function useVendor(id?: string) {
  return useQuery<VendorResponse>({
    queryKey: vendorDetailKey(id ?? ""),
    queryFn: () => getVendor(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVendorRequest) => createVendor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}

export function useUpdateVendor(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateVendorRequest) => updateVendor(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}

export function useDeleteVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}
