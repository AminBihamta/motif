import Link from "next/link";
import DeleteAccountButton from "./delete-account-button";
import MotifLogo from "./motif-logo";
import SiteMobileNav from "./site-mobile-nav";
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
    <header className="sticky top-0 z-30 flex min-h-16 items-stretch border-b-2 border-motif-ivory bg-motif-black">
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

      <div className="ml-auto hidden items-stretch md:flex lg:ml-0">
        <nav className="flex items-stretch">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClassName}>
              {link.label}
            </Link>
          ))}
          {isSignedIn ? (
            <>
              <DeleteAccountButton />
              <form action={signOutAction} className="flex items-stretch">
                <button type="submit" className={navLinkClassName}>
                  Sign out
                </button>
              </form>
            </>
          ) : null}
        </nav>
        <Link
          href="/find-my-vibe"
          className="flex shrink-0 items-center border-l-2 border-motif-ivory bg-motif-red px-4 text-[10px] font-black uppercase tracking-[0.18em] transition-colors hover:bg-motif-ivory hover:text-motif-red focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-black sm:px-6 sm:text-xs"
        >
          Find my vibe ↗
        </Link>
      </div>

      <div className="ml-auto flex items-stretch md:hidden">
        <Link
          href="/find-my-vibe"
          className="flex items-center border-l-2 border-motif-ivory bg-motif-red px-4 text-[10px] font-black uppercase tracking-[0.16em] transition-colors hover:bg-motif-ivory hover:text-motif-red focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-black"
        >
          Find my vibe ↗
        </Link>
        <SiteMobileNav isSignedIn={isSignedIn} />
      </div>
    </header>
  );
}
