"use client";

import { Menu, Xmark } from "iconoir-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import DeleteAccountButton from "./delete-account-button";
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

const sidebarLinkClassName =
  "flex w-full items-center border-b-2 border-motif-ivory px-6 py-5 text-sm font-black uppercase tracking-[0.16em] text-motif-ivory transition-colors hover:bg-motif-blue focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-red";

const sidebarDangerClassName =
  "flex w-full items-center border-b-2 border-motif-ivory px-6 py-5 text-left text-sm font-black uppercase tracking-[0.16em] text-motif-taupe transition-colors hover:bg-motif-red hover:text-motif-ivory focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-red";

export default function SiteMobileNav({
  isSignedIn = false,
}: {
  isSignedIn?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const navLinks = isSignedIn ? memberNavLinks : guestNavLinks;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="flex md:hidden">
      <button
        type="button"
        className="flex items-center justify-center border-l-2 border-motif-ivory px-4 text-motif-ivory transition-colors hover:bg-motif-blue focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-red"
        aria-expanded={open}
        aria-controls={titleId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <Xmark aria-hidden="true" className="size-6" strokeWidth={2} />
        ) : (
          <Menu aria-hidden="true" className="size-6" strokeWidth={2} />
        )}
      </button>

      {open ? (
        <div className="fixed inset-0 top-16 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-motif-black/70"
            onClick={closeMenu}
          />
          <aside
            id={titleId}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col border-l-2 border-motif-ivory bg-motif-black shadow-[-12px_0_0_var(--color-motif-red)]"
          >
            <p className="border-b-2 border-motif-ivory px-6 py-4 text-[10px] font-bold uppercase tracking-[0.28em] text-motif-taupe">
              Taste is not a trend report
            </p>

            <nav className="flex flex-1 flex-col overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={sidebarLinkClassName}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}

              {isSignedIn ? (
                <>
                  <DeleteAccountButton className={sidebarDangerClassName} />
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className={sidebarLinkClassName}
                      onClick={closeMenu}
                    >
                      Sign out
                    </button>
                  </form>
                </>
              ) : null}
            </nav>

            <Link
              href="/find-my-vibe"
              onClick={closeMenu}
              className="mt-auto border-t-2 border-motif-ivory bg-motif-red px-6 py-5 text-sm font-black uppercase tracking-[0.18em] text-motif-ivory transition-colors hover:bg-motif-ivory hover:text-motif-red"
            >
              Find my vibe ↗
            </Link>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
