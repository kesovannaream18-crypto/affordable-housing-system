import './globals.css'
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
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          
          <footer className="bg-slate-900 text-white p-8 text-center border-t border-slate-800">
            <div className="flex flex-wrap justify-center gap-6 mb-4">
              <Link href="/" className="hover:text-blue-400">🏠 Home</Link>
              <Link href="/status" className="hover:text-blue-400">🔍 Status</Link>
              <Link href="/admin" className="hover:text-blue-400">📊 Admin</Link>
              <Link href="/developers" className="hover:text-emerald-400">🏢 Developers</Link>
              <Link href="/map" className="hover:text-purple-400">🗺️ Map View</Link>
            </div>
            <p className="text-slate-500 text-xs uppercase tracking-widest">MLMUPC Portal © 2026</p>
          </footer>
        </div>
      </body>
    </html>
  )
}