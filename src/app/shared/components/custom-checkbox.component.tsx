import React from 'react';
import { motion } from 'motion/react';

export type CheckboxSize = 'sm' | 'md' | 'lg';
export type CheckboxVariant = 'brand' | 'emerald' | 'indigo' | 'amber' | 'dark';

export interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  id?: string;
  name?: string;
  'aria-label'?: string;
}

const VARIANT_STYLES: Record<CheckboxVariant, { checkedBg: string; borderChecked: string; ringColor: string; checkColor: string }> = {
  brand: {
    checkedBg: 'bg-[#1760FF]',
    borderChecked: 'border-[#1760FF]',
    ringColor: 'focus-visible:ring-[#1760FF]/25',
    checkColor: 'stroke-white',
  },
  emerald: {
    checkedBg: 'bg-[#12B76A]',
    borderChecked: 'border-[#12B76A]',
    ringColor: 'focus-visible:ring-[#12B76A]/25',
    checkColor: 'stroke-white',
  },
  indigo: {
    checkedBg: 'bg-indigo-600',
    borderChecked: 'border-indigo-600',
    ringColor: 'focus-visible:ring-indigo-500/25',
    checkColor: 'stroke-white',
  },
  amber: {
    checkedBg: 'bg-[#F59E0B]',
    borderChecked: 'border-[#F59E0B]',
    ringColor: 'focus-visible:ring-[#F59E0B]/25',
    checkColor: 'stroke-white',
  },
  dark: {
    checkedBg: 'bg-[#081B3A]',
    borderChecked: 'border-[#081B3A]',
    ringColor: 'focus-visible:ring-slate-900/25',
    checkColor: 'stroke-white',
  },
};

const SIZE_STYLES: Record<CheckboxSize, { box: string; icon: string; strokeWidth: number; text: string; desc: string }> = {
  sm: {
    box: 'w-4 h-4 rounded-md',
    icon: 'w-3 h-3',
    strokeWidth: 3,
    text: 'text-xs',
    desc: 'text-[11px]',
  },
  md: {
    box: 'w-5 h-5 rounded-lg',
    icon: 'w-3.5 h-3.5',
    strokeWidth: 2.8,
    text: 'text-sm',
    desc: 'text-xs',
  },
  lg: {
    box: 'w-6 h-6 rounded-lg',
    icon: 'w-4 h-4',
    strokeWidth: 2.5,
    text: 'text-base',
    desc: 'text-xs sm:text-sm',
  },
};

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  label,
  description,
  badge,
  size = 'md',
  variant = 'brand',
  disabled = false,
  className = '',
  containerClassName = '',
  id,
  name,
  'aria-label': ariaLabel,
}) => {
  const vStyle = VARIANT_STYLES[variant];
  const sStyle = SIZE_STYLES[size];

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  const checkboxBox = (
    <motion.div
      whileHover={disabled ? undefined : { scale: 1.05 }}
      whileTap={disabled ? undefined : { scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      tabIndex={disabled ? -1 : 0}
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        e.stopPropagation();
        handleToggle();
      }}
      className={`relative inline-flex items-center justify-center shrink-0 border transition-colors select-none cursor-pointer focus:outline-none focus-visible:ring-3 ${
        sStyle.box
      } ${vStyle.ringColor} ${
        checked
          ? `${vStyle.checkedBg} ${vStyle.borderChecked} shadow-xs`
          : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50/50'
      } ${disabled ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-200' : ''} ${className}`}
    >
      {/* Animated SVG Checkmark */}
      <svg
        className={`${sStyle.icon} pointer-events-none`}
        viewBox="0 0 24 24"
        fill="none"
      >
        <motion.path
          d="M4 12.5L9.5 18L20 6"
          className={vStyle.checkColor}
          strokeWidth={sStyle.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{
            pathLength: checked ? 1 : 0,
            opacity: checked ? 1 : 0,
          }}
          transition={{
            pathLength: { type: 'spring', stiffness: 500, damping: 35 },
            opacity: { duration: 0.15 },
          }}
        />
      </svg>

      {/* Hidden native input for form accessibility */}
      {name && (
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          disabled={disabled}
          onChange={() => {}}
          className="sr-only"
          tabIndex={-1}
        />
      )}
    </motion.div>
  );

  // If no label or description, return the standalone box
  if (!label && !description) {
    return checkboxBox;
  }

  return (
    <label
      onClick={handleToggle}
      className={`group inline-flex items-start gap-3 select-none ${
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      } ${containerClassName}`}
    >
      <div className="pt-0.5">{checkboxBox}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {label && (
            <span
              className={`font-semibold text-slate-800 group-hover:text-slate-900 transition-colors ${sStyle.text}`}
            >
              {label}
            </span>
          )}
          {badge && <span className="shrink-0">{badge}</span>}
        </div>

        {description && (
          <p className={`text-slate-500 font-normal leading-relaxed mt-0.5 ${sStyle.desc}`}>
            {description}
          </p>
        )}
      </div>
    </label>
  );
};
