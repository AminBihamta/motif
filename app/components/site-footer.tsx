import Link from "next/link";

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
  { href: "/contact", label: "Contact" },
] as const;

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t-2 border-motif-ivory bg-motif-red text-motif-ivory">
      <div className="grid sm:grid-cols-3">
        <div className="flex flex-col gap-4 border-b-2 border-motif-ivory px-5 py-6 sm:border-b-0 sm:border-r-2 sm:px-6 sm:py-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">
            Motif © 2026
          </p>
          <nav
            aria-label="Legal"
            className="grid grid-cols-2 gap-x-4 gap-y-3 text-[10px] font-black uppercase tracking-[0.18em] sm:flex sm:flex-wrap sm:gap-x-4 sm:gap-y-2"
          >
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link
          href="/contact"
          className="hidden items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:bg-motif-ivory hover:text-motif-red sm:flex"
        >
          Contact Motif
        </Link>

        <Link
          href="/find-my-vibe"
          className="flex items-center justify-between gap-4 px-5 py-5 text-[11px] font-black uppercase tracking-[0.18em] transition-colors hover:bg-motif-ivory hover:text-motif-red sm:justify-end sm:border-l-2 sm:border-motif-ivory sm:px-6 sm:text-[10px] sm:tracking-[0.2em]"
        >
          <span>Find my vibe</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </footer>
  );
}
