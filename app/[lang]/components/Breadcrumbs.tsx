import Link from "next/link";

import type { BreadcrumbItem } from "@/lib/seo";

import "./Breadcrumbs.css";

/**
 * Visible breadcrumb trail for the nested routes (store, product). Rendered on
 * the server, so it costs no client JavaScript; the matching `BreadcrumbList`
 * JSON-LD is emitted by the page itself.
 */
export default function Breadcrumbs({
  items,
  label,
}: {
  items: BreadcrumbItem[];
  label: string;
}) {
  if (items.length < 2) return null;

  return (
    <nav className="breadcrumbs" aria-label={label}>
      <ol className="breadcrumbs-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href} className="breadcrumbs-item">
              {isLast ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <>
                  <Link href={item.href} data-hover-target>
                    {item.name}
                  </Link>

                  <span className="breadcrumbs-separator" aria-hidden="true">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}