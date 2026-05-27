import { useEffect, useRef } from "react";

export function FitText({ children, className }: { children: string; className?: string }) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    const parent = el.parentElement!;
    
    const resize = () => {
      el.style.fontSize = "1px";
      const ratio = parent.clientWidth / el.scrollWidth;
      el.style.fontSize = `${ratio}px`;
    };
    
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [children]);

  return (
    <span ref={spanRef} className={`block whitespace-nowrap ${className}`}>
      {children}
    </span>
  );
}