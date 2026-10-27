import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  dotColor?: string;
  badgeClasses?: {
    bg: string;
    text: string;
    border: string;
  };
  icon?: React.ReactNode;
  description?: string;
}

export interface CustomDropdownProps<T extends string = string> {
  value: T;
  onChange: (newValue: T) => void;
  options: DropdownOption<T>[];
  variant?: 'status-pill' | 'select' | 'compact-pill';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  title?: string;
  align?: 'left' | 'right';
  placeholder?: string;
  readOnly?: boolean;
}

export function CustomDropdown<T extends string = string>({
  value,
  onChange,
  options,
  variant = 'status-pill',
  size = 'md',
  disabled = false,
  className = '',
  menuClassName = '',
  title,
  align = 'left',
  placeholder = 'Seleccionar...',
  readOnly = false,
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'bottom' | 'top'>('bottom');
  const [coords, setCoords] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    width?: number;
  }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentOption = options.find((opt) => opt.value === value) || options[0];

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Si hay menos de 240px abajo y más espacio arriba, abrir hacia arriba
    const openUpwards = spaceBelow < 240 && spaceAbove > 240;
    setMenuPosition(openUpwards ? 'top' : 'bottom');

    const newCoords: typeof coords = {};
    if (openUpwards) {
      newCoords.bottom = Math.round(window.innerHeight - rect.top + 6);
    } else {
      newCoords.top = Math.round(rect.bottom + 6);
    }

    if (align === 'right') {
      newCoords.right = Math.round(window.innerWidth - rect.right);
    } else {
      newCoords.left = Math.round(rect.left);
    }

    if (variant === 'select') {
      newCoords.width = Math.round(rect.width);
    }

    setCoords(newCoords);
  }, [align, variant]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || readOnly) return;
    updatePosition();
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (e: React.MouseEvent, optValue: T) => {
    e.stopPropagation();
    if (disabled || readOnly) return;
    onChange(optValue);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      updatePosition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  // Tamaños para badge / status pill
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    md: 'text-xs sm:text-sm px-3 py-1.5 gap-2 font-bold',
    lg: 'text-sm sm:text-base px-4 py-2 gap-2.5 font-bold',
  }[size];

  // Si es readOnly, renderizar solo el pill sin interactividad
  if (readOnly) {
    const badgeBg = currentOption?.badgeClasses?.bg || 'bg-slate-100';
    const badgeText = currentOption?.badgeClasses?.text || 'text-slate-700';
    const badgeBorder = currentOption?.badgeClasses?.border || 'border-slate-200';

    return (
      <span
        className={`inline-flex items-center rounded-full border ${badgeBg} ${badgeText} ${badgeBorder} ${sizeClasses} ${className}`}
        title={title}
      >
        {currentOption?.dotColor && (
          <span className={`w-2 h-2 rounded-full shrink-0 ${currentOption.dotColor}`} />
        )}
        <span>{currentOption?.label || value}</span>
      </span>
    );
  }

  // Render según variant
  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${variant === 'select' ? 'w-full' : ''}`}
    >
      {variant === 'status-pill' && (
        <button
          ref={triggerRef}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          title={title || 'Haz clic para cambiar estado'}
          className={`group inline-flex items-center rounded-full border transition-all duration-150 cursor-pointer select-none active:scale-[0.98] ${
            currentOption?.badgeClasses?.bg || 'bg-slate-100'
          } ${currentOption?.badgeClasses?.text || 'text-slate-800'} ${
            currentOption?.badgeClasses?.border || 'border-slate-200'
          } ${sizeClasses} ${
            isOpen
              ? 'ring-2 ring-blue-500/25 shadow-md shadow-blue-500/10'
              : 'hover:shadow-xs hover:border-slate-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
          {currentOption?.dotColor && (
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${currentOption.dotColor} ${
                isOpen ? 'animate-pulse' : ''
              }`}
            />
          )}
          <span className="truncate">{currentOption?.label || value}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 shrink-0 opacity-60 transition-transform duration-200 group-hover:opacity-100 ${
              isOpen ? 'rotate-180 opacity-100' : ''
            }`}
          />
        </button>
      )}

      {variant === 'compact-pill' && (
        <button
          ref={triggerRef}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          title={title || 'Haz clic para cambiar'}
          className={`group inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold gap-1.5 transition-all duration-150 cursor-pointer select-none active:scale-[0.98] ${
            currentOption?.badgeClasses?.bg || 'bg-slate-100'
          } ${currentOption?.badgeClasses?.text || 'text-slate-800'} ${
            currentOption?.badgeClasses?.border || 'border-slate-200'
          } ${
            isOpen
              ? 'ring-2 ring-blue-500/25 shadow-sm'
              : 'hover:shadow-xs hover:border-slate-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
          {currentOption?.dotColor && (
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentOption.dotColor}`} />
          )}
          <span className="truncate">{currentOption?.label || value}</span>
          <ChevronDown
            className={`w-3 h-3 shrink-0 opacity-60 transition-transform duration-200 group-hover:opacity-100 ${
              isOpen ? 'rotate-180 opacity-100' : ''
            }`}
          />
        </button>
      )}

      {variant === 'select' && (
        <button
          ref={triggerRef}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          title={title}
          className={`w-full flex items-center justify-between gap-2.5 bg-white hover:bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 transition-all duration-150 focus:outline-none cursor-pointer ${
            isOpen
              ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white'
              : 'hover:border-slate-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''} ${className}`}
        >
          <div className="flex items-center gap-2 truncate">
            {currentOption?.icon && (
              <span className="shrink-0 text-slate-500">{currentOption.icon}</span>
            )}
            {currentOption?.dotColor && (
              <span className={`w-2 h-2 rounded-full shrink-0 ${currentOption.dotColor}`} />
            )}
            <span className="truncate">{currentOption?.label || placeholder}</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-blue-600' : ''
            }`}
          />
        </button>
      )}

      {/* Floating Menu Popover rendered in document.body via Portal to prevent table clipping & unwanted scrollbars */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.94, y: menuPosition === 'top' ? 6 : -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: menuPosition === 'top' ? 4 : -4 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                top: coords.top !== undefined ? `${coords.top}px` : undefined,
                bottom: coords.bottom !== undefined ? `${coords.bottom}px` : undefined,
                left: coords.left !== undefined ? `${coords.left}px` : undefined,
                right: coords.right !== undefined ? `${coords.right}px` : undefined,
                width: coords.width !== undefined ? `${coords.width}px` : undefined,
                zIndex: 99999,
              }}
              className={`min-w-[200px] w-max max-w-xs bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-900/15 border border-slate-200/90 p-1.5 space-y-1 ${
                menuPosition === 'top' ? 'origin-bottom' : 'origin-top'
              } ${menuClassName}`}
              onClick={(e) => e.stopPropagation()}
            >
              {title && (
                <div className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-slate-400 border-b border-slate-100 mb-1">
                  {title}
                </div>
              )}

              <div className="max-h-60 overflow-y-auto scrollbar-thin space-y-0.5 pr-0.5">
                {options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={(e) => handleSelect(e, opt.value)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-100 cursor-pointer text-left ${
                        isSelected
                          ? `${opt.badgeClasses?.bg || 'bg-blue-50'} ${
                              opt.badgeClasses?.text || 'text-blue-900'
                            } font-bold shadow-xs`
                          : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {opt.dotColor && (
                          <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dotColor}`} />
                        )}
                        {opt.icon && (
                          <span className="shrink-0 text-slate-500">{opt.icon}</span>
                        )}
                        <div className="truncate">
                          <div className="truncate">{opt.label}</div>
                          {opt.description && (
                            <div className="text-[10px] font-normal text-slate-400 truncate">
                              {opt.description}
                            </div>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 shrink-0 text-current opacity-90 stroke-[2.5]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
