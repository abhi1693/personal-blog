import Link from 'next/link'

interface BreadcrumbsProps {
  links: { label: string; href?: string }[]
}

export default function Breadcrumbs({ links }: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex text-sm text-gray-500 space-x-2">
        {links.map((link, index) => (
          <li key={index} className="flex items-center">
            {link.href ? (
              <Link
                href={link.href}
                className="hover:underline"
                prefetch={false}
              >
                {link.label}
              </Link>
            ) : (
              <span className="text-gray-700">{link.label}</span>
            )}
            {index < links.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
