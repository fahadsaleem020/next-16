import "./globals.css";
import { Roboto, Roboto_Mono } from "next/font/google";
import { ReactQueryProvider } from "@/providers/reactquery.provider";
import { ThemeProvider } from "@/providers/theme.provider";
import { Toaster } from "@/ui/sonner";

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

const robotMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={`${robotoSans.variable}  ${robotMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReactQueryProvider>
            {children}
            <Toaster />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
