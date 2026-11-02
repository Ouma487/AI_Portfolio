import type { AnchorHTMLAttributes } from 'react';

/**
 * Every link that leaves the site goes through here, so it always opens in a
 * new tab with `rel="noopener noreferrer"` (the new page can't reach back
 * into this one via window.opener, and no referrer is leaked) and tells
 * screen-reader users that it opens a new tab. `mailto:` links are passed
 * through unchanged.
 */
export default function ExternalLink({
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const isWeb = /^https?:\/\//.test(props.href);
  if (!isWeb) return <a {...props}>{children}</a>;
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
