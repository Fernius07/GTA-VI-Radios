import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

interface MarqueeTextProps {
  children: ReactNode;
  /** Changing key resets measurement & animation cleanly when song changes */
  watchKey: string;
  className?: string;
}

export function MarqueeText({
  children,
  watchKey,
  className = '',
}: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLSpanElement | null>(null);
  const [overflowPx, setOverflowPx] = useState(0);

  const measure = () => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;
    const diff = Math.ceil(content.scrollWidth - container.clientWidth);
    setOverflowPx(diff > 2 ? diff : 0);
  };

  useLayoutEffect(() => {
    measure();
  }, [watchKey]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(container);
    return () => observer.disconnect();
  }, [watchKey]);

  const shouldAnimate = overflowPx > 2;
  const durationSeconds = shouldAnimate
    ? Math.max(7, Math.min(24, (overflowPx / 35) * 2 + 4.5))
    : 0;

  const animStyle = shouldAnimate
    ? ({
        '--marquee-distance': `-${overflowPx + 8}px`,
        '--marquee-duration': `${durationSeconds.toFixed(2)}s`,
      } as CSSProperties)
    : undefined;

  return (
    <div
      ref={containerRef}
      className={`min-w-0 overflow-hidden whitespace-nowrap ${
        shouldAnimate ? 'marquee-fade' : ''
      } ${className}`}
    >
      <span
        key={watchKey}
        ref={contentRef}
        style={animStyle}
        className={`inline-block whitespace-nowrap ${
          shouldAnimate ? 'marquee-animate' : ''
        }`}
      >
        {children}
      </span>
    </div>
  );
}
