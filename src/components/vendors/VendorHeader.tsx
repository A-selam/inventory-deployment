export default function VendorHeader() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Vendors
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage supplier contacts, locations, status, and lead time
            performance across the warehouse network.
          </p>
        </div>
      </div>
    </div>
  );
}
