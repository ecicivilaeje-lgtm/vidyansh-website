"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { menuLinks, pillars, secondaryNav, contact } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export function SiteHeader() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const openBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(!home || y > window.innerHeight * 0.6);
      setHidden(y > lastY.current && y > window.innerHeight);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

  const close = useCallback(() => {
    setOpen(false);
    openBtn.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panel.current) {
        const focusables =
          panel.current.querySelectorAll<HTMLElement>("a, button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ivory focus:px-4 focus:py-3 focus:text-ink"
      >
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[transform,background-color,border-color] duration-500 ease-out-expo ${
          scrolled
            ? "border-b border-[var(--line-d)] bg-ink/85 backdrop-blur-xl"
            : "border-b border-transparent"
        } ${hidden && !open ? "-translate-y-full" : ""}`}
      >
        <div className="container-v flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" aria-label="Vidyansh, home" className="shrink-0">
            <Logo
              size={48}
              decorative
              className="size-11 sm:size-12"
            />
          </Link>

          <nav aria-label="Main" className="hidden items-stretch lg:flex">
            {pillars.map((p) => {
              const current =
                !p.href.startsWith("/#") && pathname.startsWith(p.href);
              return (
                <Link
                  key={p.label}
                  href={p.href}
                  aria-current={current ? "page" : undefined}
                  className="group relative grid gap-0.5 border-l border-[var(--line-d)] px-5 py-1.5 first:border-l-0"
                >
                  {current && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-5 -bottom-[0.95rem] h-px bg-ivory"
                    />
                  )}
                  <span
                    className={`font-mono text-[0.5625rem] font-medium tracking-[0.22em] uppercase transition-colors group-hover:text-ivory ${current ? "text-ivory" : "text-mute-d"}`}
                  >
                    {p.verb}
                  </span>
                  <span className="font-mono text-[0.71875rem] font-medium tracking-[0.15em] text-ivory uppercase">
                    {p.label}
                  </span>
                </Link>
              );
            })}
            <span
              aria-hidden="true"
              className="mx-4 my-2 w-px bg-[var(--line-d)]"
            />
            {secondaryNav.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                aria-current={pathname.startsWith(l.href) ? "page" : undefined}
                className="self-center px-3 font-mono text-[0.6875rem] font-medium tracking-[0.15em] text-mute-d uppercase transition-colors hover:text-ivory aria-[current=page]:text-ivory"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Button
              href="/contact"
              size="sm"
              className={`hidden transition-opacity sm:inline-flex ${scrolled ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              Book a call
            </Button>
            <button
              ref={openBtn}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex items-center gap-3 py-3 font-mono text-[0.71875rem] font-medium tracking-[0.16em] uppercase"
            >
              Menu
              <span aria-hidden="true" className="grid gap-[5px]">
                <span className="block h-px w-6 bg-current" />
                <span className="block h-px w-6 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          ref={panel}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] grid grid-cols-1 gap-10 overflow-y-auto bg-ink px-[var(--gutter)] pt-[calc(6rem+env(safe-area-inset-top))] pb-10 md:grid-cols-[1.3fr_1fr]"
        >
          <button
            ref={closeBtn}
            type="button"
            onClick={close}
            className="absolute top-[calc(1.25rem+env(safe-area-inset-top))] right-[var(--gutter)] border border-[var(--line-d)] px-4 py-2.5 font-mono text-[0.6875rem] tracking-[0.16em] uppercase hover:border-ivory"
          >
            Close ✕
          </button>
          <nav aria-label="Menu links">
            <ol className="border-t border-[var(--line-d)]">
              {menuLinks.map((l, i) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-b border-[var(--line-d)] py-3.5"
                  >
                    <span className="font-mono text-xs text-mute-d">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[clamp(2.1rem,5vw,4rem)] leading-none transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-2.5 group-hover:italic">
                      {l.label}
                    </span>
                    <span className="font-mono text-xs text-mute-d">
                      {l.hint}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <aside className="grid content-end gap-6">
            <p className="eyebrow">Counselling desk</p>
            <p className="max-w-sm text-[0.9375rem] text-mute-d">
              Speak to the Vidyansh team about the right course or test series
              for you. {contact.phone}.
            </p>
            <Button
              href="/contact"
              className="justify-self-start"
              onClick={() => setOpen(false)}
            >
              Book a counselling call
            </Button>
            <p className="eyebrow">Hindi · English</p>
          </aside>
        </div>
      )}
    </>
  );
}
