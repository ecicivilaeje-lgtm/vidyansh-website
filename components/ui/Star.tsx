/** The four-point star from the Vidyansh logo, used for "destination" moments only. */
export function Star({ className = "", color = "#c8902f" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path d="M10 0 L11.6 8.4 L20 10 L11.6 11.6 L10 20 L8.4 11.6 L0 10 L8.4 8.4Z" fill={color} />
    </svg>
  );
}
