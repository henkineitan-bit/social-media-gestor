import React from 'react';
import { QuoteStatus } from '../../core/models/quote.model';
import { CustomDropdown, DropdownOption } from './custom-dropdown.component';

interface StatusBadgeProps {
  status: QuoteStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const STATUS_CONFIG: Record<
  QuoteStatus,
  { label: string; bg: string; text: string; border: string; dot: string; description: string }
> = {
  DRAFT: {
    label: 'Borrador',
    bg: 'bg-[#EEF2F8]',
    text: 'text-[#64748B]',
    border: 'border-[#DCE6F4]',
    dot: 'bg-[#64748B]',
    description: 'Propuesta en borrador preliminar',
  },
  SENT: {
    label: 'Enviada',
    bg: 'bg-[#E8F0FF]',
    text: 'text-[#1760FF]',
    border: 'border-[#B8D2FF]',
    dot: 'bg-[#1760FF]',
    description: 'Compartida con el cliente',
  },
  APPROVED: {
    label: 'Aprobada',
    bg: 'bg-[#DDF8EC]',
    text: 'text-[#12B76A]',
    border: 'border-[#B6EED1]',
    dot: 'bg-[#12B76A]',
    description: 'Aceptada y lista para operar',
  },
  REJECTED: {
    label: 'Rechazada',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    description: 'Rechazada o descartada',
  },
};

export const QUOTE_STATUS_OPTIONS: DropdownOption<QuoteStatus>[] = (
  Object.keys(STATUS_CONFIG) as QuoteStatus[]
).map((key) => ({
  value: key,
  label: STATUS_CONFIG[key].label,
  dotColor: STATUS_CONFIG[key].dot,
  badgeClasses: {
    bg: STATUS_CONFIG[key].bg,
    text: STATUS_CONFIG[key].text,
    border: STATUS_CONFIG[key].border,
  },
  description: STATUS_CONFIG[key].description,
}));

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5 font-semibold',
    md: 'text-xs sm:text-sm px-3 py-1 gap-2 font-bold',
    lg: 'text-sm sm:text-base px-4 py-1.5 gap-2 font-bold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};

export interface QuoteStatusDropdownProps {
  status: QuoteStatus;
  onChange: (newStatus: QuoteStatus) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const QuoteStatusDropdown: React.FC<QuoteStatusDropdownProps> = ({
  status,
  onChange,
  size = 'md',
  className = '',
  disabled = false,
}) => {
  return (
    <CustomDropdown<QuoteStatus>
      value={status}
      onChange={onChange}
      options={QUOTE_STATUS_OPTIONS}
      variant="status-pill"
      size={size}
      className={className}
      disabled={disabled}
      title="Cambiar estado de la propuesta"
    />
  );
};
