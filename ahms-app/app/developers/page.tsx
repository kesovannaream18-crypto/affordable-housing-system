import Link from 'next/link'

export default function DevelopersPage() {
  const developers = [
    { 
      id: 1, 
      name: "Arakawa Co., Ltd", 
      project: "Arakawa Residence", 
      location: "Sen Sok, Phnom Penh",
      units: "2,000+", 
      status: "Completed", 
      icon: "🏢" 
    },
    { 
      id: 2, 
      name: "Worldbridge Homes Co., Ltd", 
      project: "Worldbridge Affordable Housing", 
      location: "S'ang, Kandal",
      units: "2,457", 
      status: "Completed", 
      icon: "🏗️" 
    },
    { 
      id: 3, 
      name: "B&BM Development Co., Ltd", 
      project: "Borey Maha Boeng Trea", 
      location: "Dangkao, Phnom Penh",
      units: "3,000+", 
      status: "Active", 
      icon: "🏘️" 
    }
  ];

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-3">Registered Housing Developers</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Official private sector partners approved by the Ministry of Land Management, Urban Planning and Construction for affordable housing projects in Cambodia.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {developers.map(dev => (
          <div key={dev.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
            <div className="text-4xl mb-4 bg-slate-50 w-16 h-16 flex items-center justify-center rounded-full border border-slate-100">{dev.icon}</div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">{dev.name}</h2>
            <p className="text-emerald-600 font-semibold text-sm mb-4">{dev.project}</p>
            
            <div className="mt-auto border-t border-slate-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Location:</span>
                <span className="font-medium text-slate-700">{dev.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Units:</span>
                <span className="font-medium text-slate-700">{dev.units}</span>
              </div>
              <div className="flex justify-between text-sm items-center pt-1">
                <span className="text-slate-500">Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                  dev.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {dev.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
         <Link href="/map" className="inline-block px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors">
            🗺️ View Projects on Map
         </Link>
      </div>
    </div>
  )
}