import Link from "next/link";
import MotifLogo from "./motif-logo";
import { signOutAction } from "./sign-out-action";

const guestNavLinks = [
  { href: "/my-vibe", label: "My vibe" },
  { href: "/contact", label: "Contact" },
  { href: "/signin", label: "Sign in" },
] as const;

const memberNavLinks = [
  { href: "/my-vibe", label: "My vibe" },
  { href: "/contact", label: "Contact" },
] as const;

const navLinkClassName =
  "flex shrink-0 items-center border-l-2 border-motif-ivory px-3 text-[10px] font-black uppercase tracking-[0.16em] text-motif-taupe transition-colors hover:bg-motif-blue hover:text-motif-ivory focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-red sm:px-5";

export default function SiteHeader({
  priority = false,
  isSignedIn = false,
}: {
  priority?: boolean;
  isSignedIn?: boolean;
}) {
  const navLinks = isSignedIn ? memberNavLinks : guestNavLinks;

  return (
    <header className="relative z-30 flex min-h-16 items-stretch border-b-2 border-motif-ivory bg-motif-black">
      <Link
        href="/"
        className="group flex items-center border-r-2 border-motif-ivory px-5 transition-colors hover:bg-motif-ivory focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-red sm:px-8"
      >
        <MotifLogo
          className="h-7 w-auto transition group-hover:brightness-0 sm:h-8"
          priority={priority}
        />
      </Link>
      <p className="hidden flex-1 items-center px-6 text-[10px] font-bold uppercase tracking-[0.3em] text-motif-taupe lg:flex">
        Taste is not a trend report
      </p>
      <nav className="ml-auto flex items-stretch overflow-x-auto lg:ml-0">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className={navLinkClassName}>
            {link.label}
          </Link>
        ))}
        {isSignedIn ? (
          <form action={signOutAction} className="flex items-stretch">
            <button type="submit" className={navLinkClassName}>
              Sign out
            </button>
          </form>
        ) : null}
      </nav>
      <Link
        href="/find-my-vibe"
        className="flex shrink-0 items-center border-l-2 border-motif-ivory bg-motif-red px-4 text-[10px] font-black uppercase tracking-[0.18em] transition-colors hover:bg-motif-ivory hover:text-motif-red focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-black sm:px-6 sm:text-xs"
      >
        Find my vibe ↗
      </Link>
    </header>
  );
}
