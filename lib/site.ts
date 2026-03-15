export const siteConfig = {
  name: "Calc Atlas",
  shortName: "CalcAtlas",
  description:
    "A fast, modern calculator library for finance, health, business, income, and everyday decisions.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://calc-atlas.vercel.app",
  ogImage: "/og-image.png",
  nav: [
    { href: "/calculators", label: "All calculators" },
    { href: "/#categories", label: "Categories" },
    { href: "/#recently-used", label: "Recent" }
  ]
};
