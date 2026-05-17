'use html'
'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fixes the default marker icons missing in Next.js builds
const icon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

// Sample Cambodia Housing Data
const projects = [
  {
    id: 1,
    name: "Arakawa Residence",
    location: "Phnom Penh (Sen Sok)",
    units: "2,000+ Units",
    coords: [11.5681, 104.8732] as [number, number],
    status: "Completed"
  },
  {
    id: 2,
    name: "Borey Maha Sen Sok",
    location: "Phnom Penh (Chbar Ampov)",
    units: "1,200 Units",
    coords: [11.5135, 104.9542] as [number, number],
    status: "Under Construction"
  }
]

export default function MapComponent() {
  // Center of Phnom Penh coordinates
  const position: [number, number] = [11.5564, 104.9282]

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden z-0">
      <MapContainer center={position} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {projects.map((project) => (
          <Marker key={project.id} position={project.coords} icon={icon}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-slate-900 text-sm">{project.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">📍 {project.location}</p>
                <p className="text-xs text-slate-700 mt-1">🏠 Size: {project.units}</p>
                <span className={`inline-block text-[10px] font-bold mt-2 px-2 py-0.5 rounded ${
                  project.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {project.status}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}