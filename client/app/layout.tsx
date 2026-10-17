import type { Metadata } from "next";

import "./globals.css";
import { RootProviders } from "./providers";


export const metadata: Metadata = {
  title: "Susu",
  description: "Susu Group Tracker",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RootProviders>
          {children}
        </RootProviders>

      </body>
    </html>
  );
}
