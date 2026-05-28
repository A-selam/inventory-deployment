"use client";

export default function ItemsHeader() {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="mb-1 text-3xl font-bold tracking-tight text-foreground">
          Inventory
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage and track all items in your warehouse.
        </p>
      </div>
    </div>
  );
}
