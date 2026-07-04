import { FileX, Plus, Search, Inbox, Briefcase, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  icon?: "default" | "search" | "inbox" | "applications";
  className?: string;
}

function EmptyState({
  title,
  description,
  action,
  secondaryAction,
  icon = "default",
  className,
}: EmptyStateProps) {
  const Icon = {
    default: FileX,
    search: Search,
    inbox: Inbox,
    applications: Briefcase,
  }[icon];

  const defaultContent = {
    applications: {
      title: "No applications logged yet",
      description: "Your dossier is empty. Start tracking your search — every application brings you closer to the offer.",
    },
    search: {
      title: "No matches on file",
      description: "Your search turned up empty. Broaden your terms or clear filters to browse the full dossier.",
    },
    inbox: {
      title: "All clear",
      description: "No new signals right now. We'll ping you when something lands.",
    },
    default: {
      title: "Nothing filed yet",
      description: "This dossier section is blank. Add your first entry to get things moving.",
    },
  };

  const content = defaultContent[icon] || defaultContent.default;

  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-6 p-12 text-center animate-fade-in-scale",
        "min-h-[300px]",
        className
      )}
    >
        <div
          className="size-20 rounded-2xl bg-surface-container-high flex items-center justify-center shrink-0 animate-fade-in-scale animate-float-gentle"
          style={{ animationDelay: "0.1s", animationFillMode: "both" }}
        >
          <Icon className="size-10 text-on-surface-variant" aria-hidden="true" />
        </div>
      <div className="flex flex-col gap-2 max-w-[340px]">
        <h3 className="text-headline-lg font-bold text-on-surface break-words">
          {title || content.title}
        </h3>
        <p className="text-body-md text-on-surface-variant break-words">
          {description || content.description}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        {action && (
          <Button onClick={action.onClick} className="shrink-0 shadow-sm hover:shadow-md transition-shadow duration-150">
            <Plus className="size-4" />
            <span className="truncate">{action.label}</span>
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" asChild className="shrink-0">
            <Link to={secondaryAction.href}>
              <ExternalLink className="size-4" />
              <span className="truncate">{secondaryAction.label}</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export { EmptyState };
