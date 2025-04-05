
// import { SessionProvider } from "next-auth/react";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./providers";

// Load custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Tropical cafe",
  description: "Created by Tanmay",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/icons/logo1.png" type="image/svg+xml" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Wrapping CartProvider and AuthProvider around children */}
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
