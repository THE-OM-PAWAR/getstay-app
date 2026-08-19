import Link from "next/link";

export interface ExploreLinkItem {
  label: string;
  href: string;
}

export interface ExploreLinksProps {
  title?: string;
  links: ExploreLinkItem[];
  className?: string;
}

export function ExploreLinks({ title = "Explore More Stays", links, className = "" }: ExploreLinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <section className={`py-6 border-t border-gray-100 dark:border-zinc-800 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {title && (
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 shrink-0">
            {title}
          </h4>
        )}
        <nav aria-label="Explore Links" className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs md:text-sm font-medium text-gray-600 dark:text-zinc-400">
          {links.map((link, index) => (
            <span key={link.href} className="inline-flex items-center gap-3">
              <Link
                href={link.href}
                className="hover:text-brand-primary dark:hover:text-white transition-colors"
              >
                {link.label}
              </Link>
              {index < links.length - 1 && (
                <span className="text-gray-300 dark:text-zinc-700 font-light select-none">
                  •
                </span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
