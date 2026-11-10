import QRCode from "qrcode";

/** Renders a QR code as a PNG data URL so a customer can scan it from the screen with a phone. */
export async function qrDataUrl(value: string): Promise<string> {
  return QRCode.toDataURL(value, { margin: 1, width: 360, color: { dark: "#0a0612", light: "#f3effc" } });
}
