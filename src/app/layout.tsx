import type { Metadata } from "next";
import "./globals.css";
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import ErrorBoundary from "@/components/error-boundary";
import ErrorPage from "./error";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
        className={cn(
          "min-h-screen bg-coolGray font-sans antialiased",
          fontSans.variable
        )}
      >
        <ErrorBoundary fallback={<ErrorPage />}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}
