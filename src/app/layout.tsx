import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Broadcast schedule", template: "%s · Broadcast schedule" },
  description: "A broadcast schedule built with Next.js",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
