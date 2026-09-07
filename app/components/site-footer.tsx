import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 grid border-t-2 border-motif-ivory bg-motif-red text-[10px] font-black uppercase tracking-[0.2em] text-motif-ivory sm:grid-cols-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b-2 border-motif-ivory px-5 py-5 sm:border-b-0 sm:border-r-2">
        <span>Motif © 2026</span>
        <Link href="/privacy" className="hover:underline">
          Privacy
        </Link>
        <Link href="/terms" className="hover:underline">
          Terms
        </Link>
        <Link href="/cookies" className="hover:underline">
          Cookies
        </Link>
        <Link href="/contact" className="hover:underline">
          Contact
        </Link>
      </div>
      <Link
        href="/contact"
        className="hidden items-center justify-center transition-colors hover:bg-motif-ivory hover:text-motif-red sm:flex"
      >
        Contact Motif
      </Link>
      <Link
        href="/find-my-vibe"
        className="border-t-0 border-motif-ivory px-5 py-5 text-right transition-colors hover:bg-motif-ivory hover:text-motif-red sm:border-l-2"
      >
        Find my vibe ↗
      </Link>
    </footer>
  );
}
