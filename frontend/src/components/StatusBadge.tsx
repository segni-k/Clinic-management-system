import Badge from './Badge';

type StatusType =
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'pending'
  | 'paid'
  | 'overdue'
  | 'active'
  | 'inactive'
  | 'dispensed';

interface StatusBadgeProps {
  status: string;
  type?: 'appointment' | 'invoice' | 'prescription' | 'general';
}

const statusConfig: Record<StatusType, { variant: 'success' | 'warning' | 'danger' | 'info' | 'secondary'; label: string }> = {
  // Appointment statuses
  scheduled: { variant: 'info', label: 'Scheduled' },
  confirmed: { variant: 'success', label: 'Confirmed' },
  completed: { variant: 'success', label: 'Completed' },
  cancelled: { variant: 'danger', label: 'Cancelled' },
  no_show: { variant: 'warning', label: 'No Show' },
  
  // Invoice statuses
  pending: { variant: 'warning', label: 'Pending' },
  paid: { variant: 'success', label: 'Paid' },
  overdue: { variant: 'danger', label: 'Overdue' },
  
  // Prescription statuses
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'secondary', label: 'Inactive' },
  dispensed: { variant: 'info', label: 'Dispensed' },
};

export const StatusBadge = ({ status, type = 'general' }: StatusBadgeProps) => {
  const normalizedStatus = status.toLowerCase() as StatusType;
  const config = statusConfig[normalizedStatus] || { variant: 'secondary' as const, label: status };

  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
};
