import { ImageResponse } from "next/og";

export const alt = "HS Bio — One link, entirely yours";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "#f3f0e8",
          color: "#171713",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 560,
            height: 560,
            borderRadius: 999,
            right: -140,
            top: -210,
            background: "#d9ccff",
            filter: "blur(4px)",
          }}
        />
        <div
          style={{
            width: 1040,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 22,
                  background: "#171713",
                  color: "#f7f5ef",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  fontWeight: 900,
                  letterSpacing: -2,
                }}
              >
                HS
              </div>
              <span style={{ fontSize: 32, fontWeight: 800 }}>HS Bio</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 80,
                fontWeight: 800,
                letterSpacing: -5,
                lineHeight: 0.98,
              }}
            >
              <span>One link.</span>
              <span style={{ color: "#7654ce" }}>Entirely yours.</span>
            </div>
            <span style={{ fontSize: 24, color: "#6d6c65" }}>
              Distinctive bio pages for modern people and brands.
            </span>
          </div>
          <div
            style={{
              width: 245,
              height: 360,
              borderRadius: 36,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              color: "white",
              background: "linear-gradient(145deg, #ff5c7c, #7951e8 55%, #42cadd)",
              boxShadow: "0 30px 70px rgba(50, 35, 95, .22)",
              transform: "rotate(5deg)",
            }}
          >
            <span style={{ fontSize: 14, opacity: 0.72 }}>YOUR SPACE</span>
            <strong style={{ fontSize: 38, marginTop: 8 }}>Made personal.</strong>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
