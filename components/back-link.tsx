import Link from "next/link";

interface BackLinkProps {
  href: string;
  children: string;
}

export const BackLink = ({ href, children }: BackLinkProps) => (
  <Link
    href={href}
    className="inline-block text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    <span aria-hidden="true">←</span> {children}
  </Link>
);
