import { ImageResponse } from "next/og";

export const alt = "Tiger Esports - Cyber Game cao cấp";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ alignItems: "center", background: "radial-gradient(circle at 75% 30%, #5b120a 0%, #070707 50%)", color: "white", display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", textAlign: "center", width: "100%" }}><div style={{ color: "#ff6a00", display: "flex", fontSize: 24, fontWeight: 700, letterSpacing: 8, textTransform: "uppercase" }}>Nâng tầm cuộc chơi</div><div style={{ display: "flex", fontSize: 94, fontWeight: 900, letterSpacing: -4, marginTop: 22, textTransform: "uppercase" }}>TIGER ESPORTS</div><div style={{ color: "#a1a1aa", display: "flex", fontSize: 30, marginTop: 18 }}>Cyber Game cao cấp cho game thủ</div></div>, size);
}
