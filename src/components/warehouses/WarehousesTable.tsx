import { MapPin, Plus, Warehouse as WarehouseIcon } from "lucide-react";

import type { Warehouse } from "@/lib/warehouses";

import StandardDataTable, {
  StandardTableHeadCell,
} from "@/components/shared/StandardDataTable";

import WarehouseRowActions from "./WarehouseRowActions";
type WarehousesTableProps = {
  warehouses: Warehouse[];
  isLoading?: boolean;
  page?: number;
  totalPages?: number;
  limit?: number;
  totalWarehouses?: number;
  title?: string;
  filters?: React.ReactNode;
  filtersOpen?: boolean;
  onToggleFilters?: () => void;
  onAddWarehouse?: () => void;
  onPageChange?: (page: number) => void;
};

export default function WarehousesTable({
  warehouses,
  isLoading = false,
  page = 1,
  totalPages = 1,
  limit = 20,
  totalWarehouses = 0,
  title = "List of warehouses",
  filters,
  filtersOpen = false,
  onToggleFilters,
  onAddWarehouse,
  onPageChange,
}: WarehousesTableProps) {
  const itemsCount = warehouses?.length ?? 0;

  return (
    <StandardDataTable
      title={title}
      page={page}
      totalPages={totalPages}
      totalItems={totalWarehouses}
      limit={limit}
      isLoading={isLoading}
      loadingText="Loading warehouses..."
      itemsCount={itemsCount}
      filters={filters}
      filtersOpen={filtersOpen}
      onToggleFilters={onToggleFilters}
      addAction={[
        {
          label: "Add Warehouse",
          icon: <Plus className="size-4" />,
          onClick: onAddWarehouse ?? undefined,
          disabled: !onAddWarehouse,
        },
      ]}
      emptyStateOverride={
        <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-[14px] border border-border bg-muted text-muted-foreground">
            <WarehouseIcon className="size-6" />
          </div>
          <p className="text-muted-foreground">No warehouses found</p>
        </div>
      }
      emptyState={{
        title: "No warehouses found",
        description: undefined,
      }}
      tableHead={
        <>
          <StandardTableHeadCell className="whitespace-nowrap has-[[role=checkbox]]:pr-0">
            {" "}
            Warehouse
          </StandardTableHeadCell>
          <StandardTableHeadCell className="whitespace-nowrap has-[[role=checkbox]]:pr-0">
            Location
          </StandardTableHeadCell>
          <StandardTableHeadCell className="w-24 pr-10 text-center">
            Actions
          </StandardTableHeadCell>
        </>
      }
      tableBody={
        <>
          {warehouses.map((warehouse) => {
            const location = warehouse.location?.trim() || "—";

            return (
              <tr
                key={warehouse.id}
                className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted"
              >
                <td className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-[10px] bg-muted text-foreground">
                      <WarehouseIcon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-foreground">
                        {warehouse.name}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    <span className="truncate">{location}</span>
                  </div>
                </td>

                <td className="w-24 pr-5 align-middle text-center">
                  <div className="flex items-center justify-center">
                    <WarehouseRowActions warehouse={warehouse} />
                  </div>
                </td>
              </tr>
            );
          })}
        </>
      }
      pagination={{
        onPageChange: onPageChange,
      }}
    />
  );
}
