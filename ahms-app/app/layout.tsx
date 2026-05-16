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
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-slate-900 p-8 border-t border-slate-800 text-center">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link href="/" className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm">🏠 Home</Link>
            <Link href="/status" className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm">🔍 Status</Link>
            <Link href="/admin" className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm">📊 Admin</Link>
          </div>
          <p className="text-slate-500 text-xs">MLMUPC © 2026</p>
        </footer>
      </body>
    </html>
  )
}