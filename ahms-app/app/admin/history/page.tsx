'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function BuyerHistory() {
  const [searchId, setSearchId] = useState('');
  const [activeRecord, setActiveRecord] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  // Mock Database for Buyer History
  const historyDb: Record<string, any> = {
    "010123456": {
      name: "SOK NY",
      project: "Arakawa Residence",
      unit: "Building A, Floor 5, Room 504",
      timeline: [
        { id: 1, date: "May 15, 2026", action: "Keys Handed Over", actor: "Property Manager", type: "success" },
        { id: 2, date: "May 10, 2026", action: "Contract Officially Signed", actor: "Legal Dept", type: "info" },
        { id: 3, date: "May 01, 2026", action: "10% Down Payment Verified", actor: "Finance Dept", type: "info" },
        { id: 4, date: "April 20, 2026", action: "Application Approved", actor: "Ministry Director", type: "success" },
        { id: 5, date: "April 02, 2026", action: "Documents Under Review", actor: "System", type: "warning" },
        { id: 6, date: "April 01, 2026", action: "Initial Application Submitted", actor: "Applicant", type: "default" }
      ]
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    if (historyDb[searchId]) {
      setActiveRecord(historyDb[searchId]);
    } else {
      setActiveRecord(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="text-slate-500 hover:text-blue-600 transition-colors">
          ← Back to Admin Ledger
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">📖 Buyer History Log</h1>
        <p className="text-slate-500 mt-2">Search audit trails and application timelines for registered buyers.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input 
            type="text" 
            placeholder="Enter National ID (Try: 010123456)" 
            className="flex-grow p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button type="submit" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors">
            Search History
          </button>
        </form>
      </div>

      {/* Results Section */}
      {searched && !activeRecord && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
          No history record found for ID: {searchId}
        </div>
      )}

      {activeRecord && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <div className="border-b border-slate-100 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-blue-900">{activeRecord.name}</h2>
            <p className="text-slate-600 font-medium">{activeRecord.project} — {activeRecord.unit}</p>
          </div>

          {/* Timeline UI */}
          <div className="relative border-l-2 border-slate-200 ml-3 md:ml-4 space-y-8 pb-4">
            {activeRecord.timeline.map((event: any) => (
              <div key={event.id} className="relative pl-8">
                {/* Timeline Dot */}
                <span className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white ${
                  event.type === 'success' ? 'bg-green-500' :
                  event.type === 'warning' ? 'bg-orange-500' :
                  event.type === 'info' ? 'bg-blue-500' : 'bg-slate-400'
                }`}></span>
                
                {/* Content */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h3 className="font-bold text-slate-800">{event.action}</h3>
                    <p className="text-sm text-slate-500 mt-1">Updated by: <span className="font-medium text-slate-700">{event.actor}</span></p>
                  </div>
                  <span className="text-sm font-medium text-slate-400 mt-2 md:mt-0 bg-slate-50 px-3 py-1 rounded-full">
                    {event.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}