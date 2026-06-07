export type ItemDetail = {
  id: string;
  sku: string;
  name: string;
  description?: string;
  stock: number;
  minimum_stock_level: number;
  selling_price: number;
  category: string;
  vendor: string;
  Bin_location: string;
  Status: string;
};
