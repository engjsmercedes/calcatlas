import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = `${siteConfig.name} social preview`;
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #effafc 0%, #dceff5 55%, #fef3c7 100%)",
          color: "#0f172a",
          fontFamily: "sans-serif",
          padding: "58px"
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            borderRadius: "34px",
            border: "1px solid #d7e5ee",
            background: "rgba(255,255,255,0.9)",
            padding: "52px",
            justifyContent: "space-between",
            gap: "28px"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", maxWidth: "620px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #0f766e 0%, #0891b2 100%)",
                    color: "#f8fafc",
                    fontSize: "30px",
                    fontWeight: 700
                  }}
                >
                  CA
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: "40px", fontWeight: 700 }}>{siteConfig.name}</div>
                  <div style={{ fontSize: "20px", color: "#476176" }}>Fast calculators for real decisions</div>
                </div>
              </div>
              <div style={{ fontSize: "72px", lineHeight: 1.05, fontWeight: 700 }}>Online calculators that feel like a product.</div>
              <div style={{ fontSize: "26px", lineHeight: 1.45, color: "#476176" }}>
                Finance, health, business, income, and everyday tools with live results, better UX, and SEO-ready pages.
              </div>
            </div>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              {['Calculator library', 'Shareable results', 'Search-ready pages'].map((tag) => (
                <div
                  key={tag}
                  style={{
                    padding: "12px 18px",
                    borderRadius: "999px",
                    border: "1px solid #d7e5ee",
                    background: "#ffffff",
                    fontSize: "18px",
                    color: "#0f6e85"
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              width: "360px",
              borderRadius: "26px",
              background: "#ffffff",
              border: "1px solid #d7e5ee",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              justifyContent: "center"
            }}
          >
            <div style={{ fontSize: "20px", color: "#476176" }}>Popular calculators</div>
            {['Mortgage Calculator', 'Salary to Hourly Calculator', 'BMI Calculator', 'Compound Interest Calculator'].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 18px",
                  borderRadius: "20px",
                  background: "#f8fbfd",
                  border: "1px solid #e1edf3",
                  fontSize: "20px"
                }}
              >
                <span>{item}</span>
                <span style={{ color: "#0f6e85" }}>?</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
