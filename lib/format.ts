/** Formats nullable catalogue values; null means "not supplied yet". */
export const orDash = (value: number | null | undefined, suffix = "") =>
  value === null || value === undefined ? "—" : `${value.toLocaleString("en-IN")}${suffix}`;

export const formatINR = (value: number | null) =>
  value === null ? "₹ —" : `₹${value.toLocaleString("en-IN")}`;

export const discountPercent = (price: number | null, original: number | null) =>
  price === null || original === null || original <= price ? null : Math.round(((original - price) / original) * 100);
