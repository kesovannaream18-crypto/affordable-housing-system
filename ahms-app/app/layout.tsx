import '../globals.css'
import { Kantumruy_Pro } from 'next/font/google'
import Link from 'next/link'

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
      <body className={khmerFont.className}>
        <div className="flex flex-col min-h-screen bg-white">
          <main className="flex-grow">{children}</main>
          <footer className="p-10 bg-slate-900 text-white text-center">
            <div className="flex justify-center gap-6 mb-4">
              <Link href="/">Home</Link>
              <Link href="/status">Status</Link>
              <Link href="/admin">Admin</Link>
            </div>
            <p className="text-xs text-slate-500">MLMUPC © 2026</p>
          </footer>
        </div>
      </body>
    </html>
  )
}