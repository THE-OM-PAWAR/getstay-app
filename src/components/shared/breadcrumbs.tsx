import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center flex-wrap gap-1 text-xs text-gray-500 dark:text-zinc-400 font-medium">
        <li>
          <Link href="/" className="hover:text-brand-primary dark:hover:text-white transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3 text-gray-400 dark:text-zinc-600 shrink-0" />
            {item.href ? (
              <Link href={item.href} className="hover:text-brand-primary dark:hover:text-white transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 dark:text-zinc-100 font-semibold truncate max-w-[220px]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
