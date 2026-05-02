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
      title: "No applications yet",
      description: "Start tracking your job search. Add positions you're interested in and we'll help you stay organized.",
    },
    search: {
      title: "No results found",
      description: "Try adjusting your search terms or clearing some filters to see more options.",
    },
    inbox: {
      title: "All caught up",
      description: "Nothing new here right now. We'll let you know when something changes.",
    },
    default: {
      title: "Nothing here yet",
      description: "Get started by adding your first item — we'll help you keep track of everything.",
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
