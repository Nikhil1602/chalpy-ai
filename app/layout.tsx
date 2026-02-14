import type { Metadata } from "next";
import { Providers } from "./providers";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: "Chalpy AI - AI Chatbots Trained on Your Data",
  description: "Build branded AI chatbots using your own data and AI models. Customize design, upload knowledge, and deploy anywhere in minutes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );

}
