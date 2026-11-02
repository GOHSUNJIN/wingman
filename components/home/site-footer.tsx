"use client";

import Link from "next/link";

const NAV = [
  { label: "How It Works", href: "#how" },
  { label: "Catalog", href: "/catalog" },
  { label: "Privacy", href: "/privacy" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer style={{ background: "#0A0A0B" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "40px 24px",
          boxSizing: "border-box",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "24px",
          fontSize: "13px",
          color: "#9C978E",
          borderTop: "1px solid #2A2A2E",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontSize: "20px",
            letterSpacing: "0.2em",
            color: "#ECEBE8",
          }}
        >
          WINGMAN
        </span>
        <nav aria-label="Footer">
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: "28px" }}>
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  style={{
                    color: "#9C978E",
                    textDecoration: "none",
                    transition: "color 180ms ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ECEBE8")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#9C978E")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <span>© 2026 Wingman · Singapore</span>
      </div>
    </footer>
  );
}
