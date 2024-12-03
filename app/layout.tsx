import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "./styles/globals.css";

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

export const metadata: Metadata = {
  title: "Calcula SISU",
  description: "Calculadora de Notas do SISU com base em dados históricos para saber a chance de entrar em um curso de ensino superior.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <link rel="icon" href="/assets/favicon.png" sizes="any" />
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
        {children}
      </body>
    </html>
  )
}
