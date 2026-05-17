import '../globals.css'
import { Kantumruy_Pro } from 'next/font/google'

const khmerFont = Kantumruy_Pro({ 
  subsets: ['khmer'],
  weight: ['400', '700'] 
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="km">
      <body className={khmerFont.className}>{children}</body>
    </html>
  )
}