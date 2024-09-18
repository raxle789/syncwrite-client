import type { Metadata } from "next";
import "./globals.css";
// import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";
// import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/error-boundary";
import ErrorPage from "./error";
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });
// import { ThemeProvider } from "@/components/theme-provider";

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

// const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

export const metadata: Metadata = {
  title: "SyncWrite",
  description: "Collaboration Docs Workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body
        className={
          `${geistSans.variable} ${geistMono.variable} min-h-screen bg-coolGray antialiased`
          // cn(
          // "min-h-screen bg-coolGray font-sans antialiased",
          // fontSans.variable,
          // )
        }
      >
        <ErrorBoundary fallback={<ErrorPage />}>
          {/* <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          > */}
          {children}
          {/* </ThemeProvider> */}
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}
