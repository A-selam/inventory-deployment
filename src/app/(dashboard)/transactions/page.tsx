"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useTransactionsList } from "@/hooks/useTransactions";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionStats from "@/components/transactions/TransactionStats";
import TransactionTable from "@/components/transactions/TransactionTable";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default function TransactionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
  const limit = parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT);
  const inbound = searchParams.get("inbound") === "1";
  const outbound = searchParams.get("outbound") === "1";
  const startDate = searchParams.get("start_date") ?? undefined;
  const endDate = searchParams.get("end_date") ?? undefined;

  useEffect(() => {
    const normalizedPage = searchParams.get("page");
    const normalizedLimit = searchParams.get("limit");

    if (normalizedPage === String(page) && normalizedLimit === String(limit)) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    params.set("limit", String(limit));

    router.replace(`/transactions?${params.toString()}`);
  }, [limit, page, router, searchParams]);

  const { data, isLoading } = useTransactionsList({
    page,
    limit,
    inbound: inbound || undefined,
    outbound: outbound || undefined,
    start_date: startDate,
    end_date: endDate,
  });

  const transactionsData = data?.data;
  const allTransactions = transactionsData?.data ?? [];
  const hasPagination =
    typeof transactionsData?.total === "number" &&
    typeof transactionsData?.page === "number" &&
    typeof transactionsData?.limit === "number" &&
    typeof transactionsData?.total_pages === "number";

  const totalItems = hasPagination
    ? transactionsData.total
    : allTransactions.length;
  const totalPages = hasPagination
    ? transactionsData.total_pages
    : Math.max(1, Math.ceil((totalItems ?? 0) / limit));
  const currentPage = Math.min(page, Math.max(totalPages ?? 0, 1));
  const transactions = hasPagination
    ? allTransactions
    : allTransactions.slice((currentPage - 1) * limit, currentPage * limit);

  const updatePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    params.set("limit", String(limit));
    router.push(`/transactions?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      <TransactionFilters />

      <TransactionStats
        totalMovements={transactionsData?.total_movement || 0}
        inbound24h={transactionsData?.inbound_24h || 0}
        outbound24h={transactionsData?.outbound_24h || 0}
        anomalies={transactionsData?.anomalies || 0}
      />

      <TransactionTable
        transactions={transactions}
        isLoading={isLoading}
        page={currentPage}
        totalPages={totalPages}
        limit={limit}
        totalItems={totalItems}
        onPageChange={updatePage}
      />
    </div>
  );
}
