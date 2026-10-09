import Image from "next/image";
import { brand } from "@/content/site";

interface Props {
  size: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  decorative?: boolean;
}

/** The official Vidyansh logo, used exactly as supplied. */
export function Logo({ size, priority, className = "", sizes, decorative }: Props) {
  return (
    <Image
      src={brand.logo.src}
      width={size}
      height={size}
      priority={priority}
      sizes={sizes ?? `${size}px`}
      alt={decorative ? "" : `${brand.name}, ${brand.byline}. ${brand.tagline}.`}
      className={`logo-edge ${className}`}
    />
  );
}
