"use client";

import { useParams } from "next/navigation";

import WarehouseDetailsPageClient from "@/components/warehouses/WarehouseDetailsPageClient";

export default function WarehouseDetailPage() {
  const params = useParams<{ warehouseId: string }>();
  return <WarehouseDetailsPageClient warehouseId={params.warehouseId} />;
}
