import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "solid" | "ghost";
type Tone = "dark" | "light";

const base =
  "inline-flex items-center justify-center gap-3 whitespace-nowrap border font-mono text-[0.75rem] font-medium uppercase leading-none tracking-[0.17em] transition-colors duration-300 ease-out-expo";

const styles: Record<Tone, Record<Variant, string>> = {
  dark: {
    solid: "border-ivory bg-ivory text-ink hover:bg-transparent hover:text-ivory",
    ghost: "border-ivory/30 bg-transparent text-ivory hover:border-ivory",
  },
  light: {
    solid: "border-ink bg-ink text-ivory hover:bg-transparent hover:text-ink",
    ghost: "border-ink/25 bg-transparent text-ink hover:border-ink",
  },
};

const sizes = { md: "px-6 py-[1.1rem]", sm: "px-4 py-3 text-[0.6875rem]" };

interface Props {
  href?: string;
  variant?: Variant;
  tone?: Tone;
  size?: keyof typeof sizes;
  diamond?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Diamond({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`inline-block size-[7px] shrink-0 rotate-45 bg-gold ${className}`} />;
}

export function Button({ href, variant = "solid", tone = "dark", size = "md", diamond, children, className = "", onClick, ...rest }: Props & Omit<ComponentProps<"button">, keyof Props>) {
  const cls = `${base} ${styles[tone][variant]} ${sizes[size]} ${className}`;
  const content = (
    <>
      {children}
      {diamond && <Diamond />}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {content}
      </Link>
    );
  }
  return (
    <button className={cls} onClick={onClick} {...rest}>
      {content}
    </button>
  );
}
