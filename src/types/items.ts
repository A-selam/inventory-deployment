export type ItemDetail = {
  id: string;
  sku: string;
  name: string;
  description: string;
  quantity_on_hand: number;
  minimum_stock_level: number;
  cost_price: number;
  selling_price: number;
  category_id: string;
  vendor_id: string;
  bin_location: string;
  is_active: boolean;
  created_at: string;
  status: string;
};
