import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

import { getCalculator } from "@/data/calculators";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function Image({ params }: { params: { slug: string } }) {
  const calculator = getCalculator(params.slug);

  if (!calculator) {
    notFound();
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #effafc 0%, #dceff5 62%, #ffffff 100%)",
          color: "#0f172a",
          fontFamily: "sans-serif",
          padding: "56px"
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            borderRadius: "34px",
            border: "1px solid #d7e5ee",
            background: "rgba(255,255,255,0.92)",
            padding: "48px",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #0f766e 0%, #0891b2 100%)",
                  color: "#f8fafc",
                  fontSize: "28px",
                  fontWeight: 700
                }}
              >
                CA
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "34px", fontWeight: 700 }}>Calc Atlas</div>
                <div style={{ fontSize: "18px", color: "#476176" }}>Fast calculators for real decisions</div>
              </div>
            </div>
            <div
              style={{
                padding: "10px 16px",
                borderRadius: "999px",
                border: "1px solid #d7e5ee",
                color: "#0f6e85",
                fontSize: "18px"
              }}
            >
              {calculator.category}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "980px" }}>
            <div style={{ fontSize: "72px", lineHeight: 1.04, fontWeight: 700 }}>{calculator.title}</div>
            <div style={{ fontSize: "28px", lineHeight: 1.4, color: "#476176" }}>{calculator.shortDescription}</div>
          </div>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            {calculator.features.slice(0, 3).map((feature) => (
              <div
                key={feature}
                style={{
                  padding: "12px 18px",
                  borderRadius: "999px",
                  border: "1px solid #d7e5ee",
                  background: "#ffffff",
                  fontSize: "18px",
                  color: "#0f6e85"
                }}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
