import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
  UIEvent,
} from 'react';

export type ScrollAreaVariant = 'default' | 'brand' | 'subtle' | 'dark' | 'minimal';
export type ScrollAreaSize = 'xs' | 'sm' | 'md' | 'none';
export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxHeight?: string | number;
  maxWidth?: string | number;
  height?: string | number;
  width?: string | number;
  variant?: ScrollAreaVariant;
  size?: ScrollAreaSize;
  orientation?: ScrollAreaOrientation;
  hoverOnly?: boolean;
  showScrollShadows?: boolean;
  shadowColor?: 'slate' | 'brand' | 'white' | 'dark';
  className?: string;
  viewportClassName?: string;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: (event: UIEvent<HTMLDivElement>) => void;
}

export interface ScrollAreaHandle {
  viewport: HTMLDivElement | null;
  scrollToTop: (smooth?: boolean) => void;
  scrollToBottom: (smooth?: boolean) => void;
  scrollTo: (options: ScrollToOptions) => void;
}

/**
 * Reusable Modern ScrollArea Component
 * Provides custom sleek scrollbars (Chrome, Edge, Firefox, Safari)
 * with support for brand styling, hover-only visibility, and dynamic scroll fade shadows.
 */
export const ScrollArea = forwardRef<ScrollAreaHandle, ScrollAreaProps>(
  (
    {
      children,
      maxHeight,
      maxWidth,
      height,
      width,
      variant = 'default',
      size = 'sm',
      orientation = 'vertical',
      hoverOnly = false,
      showScrollShadows = false,
      shadowColor = 'slate',
      className = '',
      viewportClassName = '',
      scrollRef,
      onScroll,
      style,
      ...restProps
    },
    ref
  ) => {
    const internalRef = useRef<HTMLDivElement | null>(null);
    const activeRef = (scrollRef as React.RefObject<HTMLDivElement | null>) || internalRef;

    const [canScrollUp, setCanScrollUp] = useState(false);
    const [canScrollDown, setCanScrollDown] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Check scroll positions to trigger smart gradient shadows
    const checkScrollState = useCallback(() => {
      const el = activeRef.current;
      if (!el) return;

      const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = el;

      // Vertical threshold (2px cushion)
      const hasVerticalOverflow = scrollHeight > clientHeight + 1;
      setCanScrollUp(hasVerticalOverflow && scrollTop > 2);
      setCanScrollDown(hasVerticalOverflow && scrollTop + clientHeight < scrollHeight - 3);

      // Horizontal threshold
      const hasHorizontalOverflow = scrollWidth > clientWidth + 1;
      setCanScrollLeft(hasHorizontalOverflow && scrollLeft > 2);
      setCanScrollRight(hasHorizontalOverflow && scrollLeft + clientWidth < scrollWidth - 3);
    }, [activeRef]);

    useEffect(() => {
      checkScrollState();

      const el = activeRef.current;
      if (!el) return;

      // Observe size changes of container and its content
      let resizeObserver: ResizeObserver | null = null;
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          checkScrollState();
        });
        resizeObserver.observe(el);
        if (el.firstElementChild) {
          resizeObserver.observe(el.firstElementChild);
        }
      }

      window.addEventListener('resize', checkScrollState);
      return () => {
        resizeObserver?.disconnect();
        window.removeEventListener('resize', checkScrollState);
      };
    }, [checkScrollState, activeRef]);

    // Expose imperative methods to parent refs
    useImperativeHandle(
      ref,
      () => ({
        viewport: activeRef.current,
        scrollToTop: (smooth = true) => {
          activeRef.current?.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
        },
        scrollToBottom: (smooth = true) => {
          if (activeRef.current) {
            activeRef.current.scrollTo({
              top: activeRef.current.scrollHeight,
              behavior: smooth ? 'smooth' : 'auto',
            });
          }
        },
        scrollTo: (options: ScrollToOptions) => {
          activeRef.current?.scrollTo(options);
        },
      }),
      [activeRef]
    );

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
      if (showScrollShadows) {
        checkScrollState();
      }
      onScroll?.(e);
    };

    // Determine overflow classes
    let overflowClass = 'overflow-y-auto overflow-x-hidden';
    if (orientation === 'horizontal') {
      overflowClass = 'overflow-x-auto overflow-y-hidden';
    } else if (orientation === 'both') {
      overflowClass = 'overflow-auto';
    }

    // Determine size class
    let sizeClass = 'scrollbar-thin';
    if (size === 'xs') sizeClass = 'scrollbar-xs';
    if (size === 'md') sizeClass = ''; // Default 7px global scrollbar
    if (size === 'none') sizeClass = 'scrollbar-none';

    // Determine variant class
    let variantClass = '';
    if (variant === 'brand') variantClass = 'scrollbar-brand';
    if (variant === 'subtle') variantClass = 'scrollbar-subtle';
    if (variant === 'dark') variantClass = 'scrollbar-dark';
    if (variant === 'minimal') variantClass = 'scrollbar-hover';

    const hoverClass = hoverOnly ? 'scrollbar-hover' : '';

    const viewportStyle: React.CSSProperties = {
      maxHeight,
      maxWidth,
      height,
      width,
      ...style,
    };

    // Shadow gradient color options
    const shadowThemes = {
      slate: {
        top: 'from-slate-900/10 to-transparent',
        bottom: 'from-slate-900/10 to-transparent',
        left: 'from-slate-900/10 to-transparent',
        right: 'from-slate-900/10 to-transparent',
      },
      brand: {
        top: 'from-blue-600/15 to-transparent',
        bottom: 'from-blue-600/15 to-transparent',
        left: 'from-blue-600/15 to-transparent',
        right: 'from-blue-600/15 to-transparent',
      },
      white: {
        top: 'from-white to-transparent',
        bottom: 'from-white to-transparent',
        left: 'from-white to-transparent',
        right: 'from-white to-transparent',
      },
      dark: {
        top: 'from-black/40 to-transparent',
        bottom: 'from-black/40 to-transparent',
        left: 'from-black/40 to-transparent',
        right: 'from-black/40 to-transparent',
      },
    };

    const currentShadowTheme = shadowThemes[shadowColor];

    return (
      <div className={`relative ${className}`}>
        {/* Top Scroll Indicator Shadow */}
        {showScrollShadows && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b ${currentShadowTheme.top} z-10 transition-opacity duration-200 ${
              canScrollUp ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Scrollable Viewport */}
        <div
          ref={activeRef}
          onScroll={handleScroll}
          className={`${overflowClass} ${sizeClass} ${variantClass} ${hoverClass} ${viewportClassName}`}
          style={viewportStyle}
          {...restProps}
        >
          {children}
        </div>

        {/* Bottom Scroll Indicator Shadow */}
        {showScrollShadows && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t ${currentShadowTheme.bottom} z-10 transition-opacity duration-200 ${
              canScrollDown ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Left Scroll Indicator Shadow */}
        {showScrollShadows && orientation !== 'vertical' && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r ${currentShadowTheme.left} z-10 transition-opacity duration-200 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Right Scroll Indicator Shadow */}
        {showScrollShadows && orientation !== 'vertical' && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l ${currentShadowTheme.right} z-10 transition-opacity duration-200 ${
              canScrollRight ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </div>
    );
  }
);

ScrollArea.displayName = 'ScrollArea';

// Optional alias for explicit naming
export const CustomScrollArea = ScrollArea;
