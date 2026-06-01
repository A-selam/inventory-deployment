export interface StockMovementChartPoint {
  month: string;
  stock_in: number;
  stock_out: number;
}

export interface RecentTransaction {
  id: string;
  item: string;
  item_name?: string;
  sku: string;
  transaction_type: string;
  quantity_change: number;
  created_at: string;
}

export interface DashboardData {
  total_items: number;
  low_stock: number;
  inventory_value: number;
  active_vendors: number;
  stock_movement_chart: StockMovementChartPoint[];
  recent_transactions: RecentTransaction[];
}
