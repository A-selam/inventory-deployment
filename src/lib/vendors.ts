import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse } from "@/types/api";

export type VendorContactPerson = {
  first_name: string;
  last_name: string;
};

export type VendorContactInfo = {
  primary_phone: string;
  secondary_phone: string;
  email: string;
};

export type VendorLocation = {
  city: string;
  country: string;
};

export type Vendor = {
  id: string;
  name: string;
  contact_person: string | VendorContactPerson;
  contact_info: string | VendorContactInfo;
  location: string | VendorLocation;
  lead_time: number;
  is_active: boolean;
  created_at: string;
  items_count: number;
};

export type VendorSortBy = "name" | "contact_person" | "lead_time";

export type VendorSortDir = "asc" | "desc";

export type VendorsListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: VendorSortBy;
  sort_dir?: VendorSortDir;
};

export type VendorsListResponse = ApiSuccessResponse<Vendor[]>;

export type VendorResponse = ApiSuccessResponse<Vendor>;

export type CreateVendorRequest = {
  name: string;
  contact_person: VendorContactPerson;
  contact_info: VendorContactInfo;
  location: VendorLocation;
  lead_time: number;
  is_active?: boolean;
};

export type UpdateVendorRequest = Partial<CreateVendorRequest>;

export type DeleteVendorResponse = ApiSuccessResponse<null>;

export async function listVendors(
  params: VendorsListQuery,
): Promise<VendorsListResponse> {
  const res = await apiClient.get("/vendors", { params });
  return res.data as VendorsListResponse;
}

export async function getVendor(id: string): Promise<VendorResponse> {
  const res = await apiClient.get(`/vendors/${id}`);
  return res.data as VendorResponse;
}

export async function createVendor(
  data: CreateVendorRequest,
): Promise<VendorResponse> {
  const res = await apiClient.post("/vendors", data);
  return res.data as VendorResponse;
}

export async function updateVendor(
  id: string,
  data: UpdateVendorRequest,
): Promise<VendorResponse> {
  const res = await apiClient.patch(`/vendors/${id}`, data);
  return res.data as VendorResponse;
}

export async function deleteVendor(id: string): Promise<DeleteVendorResponse> {
  const res = await apiClient.delete(`/vendors/${id}`);
  return res.data as DeleteVendorResponse;
}
