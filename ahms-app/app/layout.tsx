import './globals.css'
import { Kantumruy_Pro } from 'next/font/google'
import Link from 'next/link'

// This makes the Khmer text look beautiful
const khmerFont = Kantumruy_Pro({ 
  subsets: ['khmer'],
  weight: ['400', '700'] 
})

export const metadata = {
  title: "MLMUPC Housing Portal",
  description: "Ministry Affordable Housing Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="km">
      <body className={`${khmerFont.className} flex flex-col min-h-screen bg-slate-50`}>
        
        {/* Main Website Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* YOUR NEW BUTTONS SECTION */}
        <footer className="bg-slate-900 p-6 border-t border-slate-800">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4">
            <Link href="/" className="px-4 py-2 bg-slate-800 hover:bg-blue-600 text-white rounded-lg text-sm transition-all border border-slate-700">
              🏠 Public Portal
            </Link>
            <Link href="/status" className="px-4 py-2 bg-slate-800 hover:bg-orange-500 text-white rounded-lg text-sm transition-all border border-slate-700">
              🔍 Status Search
            </Link>
            <Link href="/admin" className="px-4 py-2 bg-slate-800 hover:bg-emerald-600 text-white rounded-lg text-sm transition-all border border-slate-700">
              📊 Admin Ledger
            </Link>
          </div>
          <p className="text-center text-slate-500 text-xs mt-4">
            Ministry of Land Management, Urban Planning and Construction © 2026
          </p>
        </footer>

      </body>
    </html>
  )
}