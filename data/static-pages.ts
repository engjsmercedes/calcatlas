export interface StaticPageLink {
  href: string;
  label: string;
  description: string;
}

export const trustPageLinks: StaticPageLink[] = [
  {
    href: "/about",
    label: "About",
    description: "Learn what Calc Atlas covers and who the calculators are built for."
  },
  {
    href: "/contact",
    label: "Contact",
    description: "Reach out with calculator suggestions, corrections, or product questions."
  },
  {
    href: "/faq",
    label: "FAQ",
    description: "See general questions about calculator accuracy, methods, and usage."
  },
  {
    href: "/methodology",
    label: "Methodology",
    description: "Review the formulas, assumptions, and logic behind the calculators."
  },
  {
    href: "/sources",
    label: "Sources",
    description: "Browse public references and standards that inform the calculator logic."
  },
  {
    href: "/privacy-policy",
    label: "Privacy Policy",
    description: "Understand what data may be collected and how the site uses it."
  },
  {
    href: "/terms-of-service",
    label: "Terms of Service",
    description: "Read the basic terms for using the website and calculators."
  },
  {
    href: "/disclaimer",
    label: "Disclaimer",
    description: "Review important limitations for health, finance, and legal estimates."
  }
];

export const contactEmail = "hello@calc-atlas.com";
