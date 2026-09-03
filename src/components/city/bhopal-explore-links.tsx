import Link from "next/link";

export interface BhopalExploreLinksProps {
  cityName: string;
  citySlug: string;
}

export function BhopalExploreLinks({ cityName, citySlug }: BhopalExploreLinksProps) {
  const links = [
    { label: "Student Accommodation", href: `/city/${citySlug}` },
    { label: "Boys Hostels", href: `/city/${citySlug}/boys-hostel` },
    { label: "Girls Hostels", href: `/city/${citySlug}/girls-hostel` },
    { label: "Affordable Hostels", href: `/city/${citySlug}/affordable` },
    { label: "Best Rated Stays", href: `/city/${citySlug}/best` },
  ];

  return (
    <section className="mt-4 mb-8 pt-3 border-t border-gray-100 dark:border-zinc-800">
      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">
        Find accommodation in {cityName}
      </h2>
      <nav aria-label={`Find accommodation in ${cityName}`} className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs md:text-sm font-medium text-gray-600 dark:text-zinc-400">
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
    </section>
  );
}
