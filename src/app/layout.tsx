import { Nunito_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/src/components/theme-provider"
import { cn } from "@/src/lib/utils";

const nunitoSans = Nunito_Sans({subsets:['latin'],variable:'--font-sans'})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn("antialiased", nunitoSans.variable, "font-sans")}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
