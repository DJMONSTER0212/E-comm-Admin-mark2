import './globals.css'
import { Poppins as FontSans } from "next/font/google"
import { cn } from '../_lib/utils'
import NextAuthProvider from '../_conf/providers/nextauth-provider'
import ReactQueryProvider from '../_conf/providers/react-query-provider'
import { Toaster } from '../_components/ui/toaster'
import SettingsProviderServer from '../_conf/providers/settings-provider/settings-provider-server'
import ThemeProvider from '../_conf/providers/theme-provider'
import NprogressProviders from '@/app/_conf/providers/nprogress-provider'

export const fontSans = FontSans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='scrollbar-thin scrollbar-thumb-black-500 scrollbar-track-black-300' suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <NprogressProviders>
          <ThemeProvider attribute="class" defaultTheme="light">
            <NextAuthProvider >
              <ReactQueryProvider>
                <SettingsProviderServer>
                  {children}
                  <Toaster />
                </SettingsProviderServer>
              </ReactQueryProvider>
            </NextAuthProvider>
          </ThemeProvider>
        </NprogressProviders>
      </body>
    </html>
  )
}
