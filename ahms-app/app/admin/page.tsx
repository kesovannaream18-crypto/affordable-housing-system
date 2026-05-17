'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link'

export default function AdminDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('housing_applications')
        .select('*, payments(*)') 
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('housing_applications')
      .update({ application_status: newStatus })
      .eq('id', id);

    if (!error) fetchApplications();
  };

  const markAsPaid = async (applicationId: string) => {
    const { error } = await supabase
      .from('payments')
      .insert([{ application_id: applicationId, status: 'VERIFIED', amount: 150 }]);

    if (!error) fetchApplications();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login'; 
  };

  // Analytics Logic
  const totalRevenue = applications.reduce((sum: number, app: any) => (app.payments?.length > 0 ? sum + 150 : sum), 0);
  const approvedApps = applications.filter((a: any) => a.application_status?.toUpperCase() === 'APPROVED').length;
  const pendingApps = applications.filter((a: any) => a.application_status?.toUpperCase() === 'PENDING').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Synchronizing Ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans text-slate-900">
      
      {/* Header Section */}
      <div className="max-w-6xl mx-auto flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-blue-900 tracking-tighter italic uppercase leading-none">Ministry Ledger</h1>
          <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Affordable Housing Management System</p>
        </div>
        <button onClick={handleLogout} className="bg-white text-red-500 font-black px-6 py-2 rounded-xl border-2 border-red-50 hover:bg-red-500 hover:text-white transition-all text-[10px] uppercase tracking-widest shadow-sm">
          Sign Out
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Revenue</p>
          <p className="text-5xl font-black text-emerald-500 mt-2 tracking-tighter">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Approved Housing</p>
          <p className="text-5xl font-black text-blue-900 mt-2 tracking-tighter">{approvedApps}<span className="text-xl text-slate-200 ml-2 italic">/ {applications.length}</span></p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pending Review</p>
          <p className="text-5xl font-black text-amber-500 mt-2 tracking-tighter">{pendingApps}</p>
        </div>
      </div>

      {/* Sleek Action Bar above the table */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end max-w-6xl mx-auto mb-4 px-1">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Recent Applications</h2>
          <p className="text-sm text-slate-500 mt-1">Manage current affordable housing requests.</p>
        </div>
        
        <Link href="/admin/history" className="mt-4 sm:mt-0 flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg font-bold transition-colors shadow-sm">
          <span>📖</span> View Buyer History Logs
        </Link>
      </div>

      {/* Main Data Table */}
      <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-white mb-10">
        <div className="bg-blue-900 text-white p-6 grid grid-cols-6 font-black uppercase text-[10px] tracking-[0.15em] italic">
          <div>Applicant</div>
          <div className="text-center">Score</div>
          <div className="text-center">Status</div>
          <div className="text-center">Payment</div>
          <div className="text-center">Evidence</div>
          <div className="text-right">Manage</div>
        </div>

        {applications.map((app) => {
          const isPaid = app.payments?.length > 0;
          return (
            <div key={app.id} className="grid grid-cols-6 p-8 border-b border-slate-50 items-center hover:bg-slate-50/50 transition-colors">
              <div className="font-black text-slate-800 uppercase tracking-tight text-sm">{app.full_name}</div>
              <div className="text-center font-black text-blue-600 italic">#{app.priority_score}</div>
              <div className="text-center">
                <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  app.application_status?.toUpperCase() === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 
                  app.application_status?.toUpperCase() === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {app.application_status}
                </span>
              </div>
              <div className="text-center">
                {isPaid ? (
                  <span className="text-emerald-500 font-black text-[10px] uppercase tracking-tighter bg-emerald-50 px-3 py-1 rounded-lg">Verified ✅</span>
                ) : (
                  <button onClick={() => markAsPaid(app.id)} className="text-slate-300 hover:text-emerald-500 text-[10px] font-black uppercase underline decoration-2 underline-offset-4 transition-all">Mark Paid</button>
                )}
              </div>
              <div className="text-center">
                <a href={app.document_url} target="_blank" className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-blue-900 hover:text-white transition-all tracking-widest">View Doc</a>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => updateStatus(app.id, 'APPROVED')} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all active:scale-90 shadow-lg shadow-emerald-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </button>
                <button onClick={() => updateStatus(app.id, 'REJECTED')} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all active:scale-90 shadow-lg shadow-red-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}