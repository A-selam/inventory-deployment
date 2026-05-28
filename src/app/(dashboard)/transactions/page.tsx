"use client";

import { useTransactionsList } from "@/hooks/useTransactions";
import TransactionHeader from "@/components/transactions/TransactionHeader";
import TransactionStats from "@/components/transactions/TransactionStats";
import TransactionTable from "@/components/transactions/TransactionTable";

export default function TransactionsPage() {
  const { data, isLoading } = useTransactionsList({
    page: 1,
    limit: 20,
  });

  const transactionsData = data?.data;

  return (
    <div className="space-y-8">
      <TransactionHeader />

      <TransactionStats
        totalMovements={transactionsData?.total_movement || 0}
        inbound24h={transactionsData?.inbound_24h || 0}
        outbound24h={transactionsData?.outbound_24h || 0}
        anomalies={transactionsData?.anomalies || 0}
      />

      <TransactionTable
        transactions={transactionsData?.data || []}
        isLoading={isLoading}
      />
    </div>
  );
}
