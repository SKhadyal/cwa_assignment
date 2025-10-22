import type { ReactNode } from "react";

export const metadata = {
  title: "API Service",
  description: "REST API service for the Escape Room project",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
