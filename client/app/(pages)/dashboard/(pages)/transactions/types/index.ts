
export type TransactionType = "contribution" | "payout";

export interface Transaction {
  id: string;
  amount: string;
  currency: string;
  groupId: string;
  groupName: string;
  recordedBy: string;
  recorderName: string;
  type: TransactionType | (string & {});
  userId: string;
  userName: string;
  week: number;
}


export interface UpdateTransactionInput {
  amount: string;
  currency: string;
  type: TransactionType;
  week: number;
}

export interface TransactionsTableProps {
  data: Transaction[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onUpdate?: (
    id: string,
    values: UpdateTransactionInput
  ) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export interface TransactionFormValues {
  amount: string;
  currency: string;
  type: TransactionType;
  week: string;
}
