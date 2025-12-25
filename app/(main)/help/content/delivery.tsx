import { MarkdownRenderer } from "../markdown-renderer";

// File: src/content/delivery/shipping-restrictions.tsx
export function ShippingRestrictions() {
  return <MarkdownRenderer fileName="shipping-restrictions" />;
}

// File: src/content/delivery/customs-taxes.tsx
export function CustomsAndTaxes() {
  return <MarkdownRenderer fileName="customs-taxes" />;
}
