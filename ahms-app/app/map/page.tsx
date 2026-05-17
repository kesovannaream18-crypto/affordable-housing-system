'use client'

import dynamic from 'next/dynamic'
import '../globals.css'

// This prevents Next.js from crashing during server-side building
const MapComponent = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] items-center justify-center bg-slate-100 rounded-xl">
        <p className="text-slate-500 font-medium animate-pulse">Loading Cambodia Housing Map...</p>
      </div>
    )
  }
)

export default function MapPage() {
  return (
    <div className="max-w-5xl mx-auto mt-8 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">🗺️ Affordable Housing Map View</h1>
        <p className="text-slate-500">Geographical locations of active and completed affordable housing developments in Cambodia.</p>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <MapComponent />
      </div>
    </div>
  )
}