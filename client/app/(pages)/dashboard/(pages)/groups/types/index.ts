export type GroupStatus = "pending" | "active" | "completed";

export interface Group {
  id: string;
  name: string;
  weeklyAmount: string;
  currency: string;
  status: GroupStatus;
  currentWeek: number;
  createdBy: string;
  createdAt: string;
}
export interface UpdateGroupInput {
    name: string;
    weeklyAmount: number;
    status: GroupStatus;
    currentWeek: number;
}

export interface GroupsTableProps {
    data: Group[];
    isLoading?: boolean;
    error?: string | null;
    onRetry?: () => void;
    onUpdate?: (id: string, values: UpdateGroupInput) => Promise<void>;
    onDelete?: (id: string) => Promise<void>;
}