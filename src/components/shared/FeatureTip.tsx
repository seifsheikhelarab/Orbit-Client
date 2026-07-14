import { useState, useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const TIPS_SHOWN = 'orbit-tips-shown';

function hasTipBeenShown(id: string): boolean {
  try {
    const shown = JSON.parse(localStorage.getItem(TIPS_SHOWN) || '[]');
    return shown.includes(id);
  } catch { return false; }
}

function markTipShown(id: string) {
  try {
    const shown = JSON.parse(localStorage.getItem(TIPS_SHOWN) || '[]');
    shown.push(id);
    localStorage.setItem(TIPS_SHOWN, JSON.stringify(shown));
  } catch { /* noop */ }
}

export function FeatureTip({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasTipBeenShown(id)) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [id]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 max-w-xs p-4 rounded-2xl bg-primary text-on-primary shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold tracking-wider text-accent mb-1">{title}</p>
          <div className="text-sm text-on-primary/80 leading-relaxed">{children}</div>
        </div>
        <button
          type="button"
          onClick={() => { setVisible(false); markTipShown(id); }}
          className="shrink-0 size-6 flex items-center justify-center rounded-full bg-on-primary/10 hover:bg-on-primary/20 transition-colors"
          aria-label="Dismiss tip"
        >
          <X className="size-3" />
        </button>
      </div>
    </div>
  );
}