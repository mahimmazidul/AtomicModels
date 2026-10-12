import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "header" | "figure";
  id?: string;
}

/** IntersectionObserver-based entrance. Disabled under reduced-motion (CSS). */
export default function Reveal({ children, className, delay = 0, as = "div", id }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as "div";
  return (
    <Tag
      id={id}
      ref={ref as never}
      className={cn("reveal", inView && "is-in", className)}
      style={{ ["--rd" as never]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
