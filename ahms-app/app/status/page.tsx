'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed
import { QRCodeSVG } from 'qrcode.react';

// Define the shape of our data
export interface HousingApplication {
  id: string;
  full_name: string;
  national_id: string;
  priority_score: number;
  application_status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function StatusPage() {
  const [nationalId, setNationalId] = useState('');
  const [searchResult, setSearchResult] = useState<HousingApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // To show "No results" message

  // Payment States
  const [showPayment, setShowPayment] = useState(false);
  const [paying, setPaying] = useState(false);

  // --- SEARCH FUNCTION ---
  const handleSearch = async () => {
    if (!nationalId.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    setSearchResult(null); // Clear previous results

    try {
      const { data, error } = await supabase
        .from('housing_applications')
        .select('*')
        .eq('national_id', nationalId.trim())
        .maybeSingle(); // Gets exactly one row, or null if not found
      
      if (error) throw error;
      setSearchResult(data as HousingApplication);

    } catch (err: any) {
      console.error("Search error:", err);
      alert("An error occurred while searching.");
    } finally {
      setLoading(false);
    }
  };

  // --- PAYMENT FUNCTION ---
  const recordPayment = async (appId: string) => {
    setPaying(true);
    try {
      const { error } = await supabase
        .from('payments')
        .insert([{
          application_id: appId,
          amount_paid: 150,
          month_index: new Date().getMonth() + 1
        }]);

      if (error) throw error;
      
      alert("Payment Successful!");
      setShowPayment(false);
    } catch (err: any) {
      alert("Payment Error: " + err.message);
    } finally {
      setPaying(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Header Section */}
      <div className="text-center mb-10 animate-in fade-in duration-500">
        <h1 className="text-3xl md:text-4xl font-black text-blue-900 uppercase tracking-tighter mb-3">
          Application Status
        </h1>
        <p className="text-gray-500 font-medium max-w-md mx-auto">
          Enter your National ID number below to check the current status of your Affordable Housing application.
        </p>
      </div>

      {/* Search Card */}
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border-t-8 border-blue-600 animate-in slide-in-from-bottom-4 duration-500 z-10">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">
          National ID Number
        </label>
        <input 
          type="text" 
          className="w-full p-4 bg-gray-50 border-2 rounded-xl focus:border-blue-600 outline-none transition-all font-bold text-gray-800 text-lg mb-6" 
          placeholder="e.g., 010123456"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        
        <button 
          onClick={handleSearch}
          disabled={loading || !nationalId.trim()}
          className="w-full py-4 bg-blue-400 text-white font-black rounded-xl uppercase tracking-widest hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? "Searching..." : "Check Status"}
        </button>
      </div>

      {/* Results Section */}
      <div className="w-full max-w-md mt-6">
        {searchResult ? (
          <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 animate-in slide-in-from-top-4 duration-300">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Applicant</p>
            <p className="text-xl font-black text-gray-900 uppercase mb-4">{searchResult.full_name}</p>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Current Status</p>
                <p className={`text-2xl font-black ${
                  searchResult.application_status === 'APPROVED' ? 'text-green-600' : 
                  searchResult.application_status === 'REJECTED' ? 'text-red-600' : 'text-amber-500'
                }`}>
                  {searchResult.application_status}
                </p>
              </div>
              
              {searchResult.application_status === 'APPROVED' && (
                <button 
                  onClick={() => setShowPayment(true)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-black uppercase shadow-md hover:bg-green-700 active:scale-95 transition-all text-sm"
                >
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ) : hasSearched && !loading ? (
          <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-100 text-center animate-in fade-in duration-300">
            <p className="font-bold text-red-600">No application found for this ID.</p>
          </div>
        ) : null}
      </div>

      {/* KHQR PAYMENT MODAL OVERLAY */}
      {showPayment && searchResult && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-[40px] max-w-sm w-full text-center shadow-2xl border-t-8 border-red-600 animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter">KHQR Payment</h2>
            <p className="text-gray-400 text-[10px] mb-8 font-black uppercase tracking-[0.2em]">Scan with ABA or Bakong</p>
            
            <div className="bg-gray-50 p-6 rounded-3xl mb-8 flex justify-center border-2 border-gray-100">
              {/* Ensure you have qrcode.react installed! */}
              <QRCodeSVG value={`https://bakong.nbc.org.kh/pay?id=MLMUPC-${searchResult.id}`} size={220} />
            </div>

            <div className="flex justify-between items-center mb-8 px-4 text-left">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Payable</p>
                <p className="text-2xl font-black text-red-600">$150.00</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Due Month</p>
                <p className="text-sm font-black text-gray-900 uppercase">May 2026</p>
              </div>
            </div>

            <button 
              onClick={() => recordPayment(searchResult.id)}
              disabled={paying}
              className="w-full py-5 bg-red-600 text-white font-black rounded-2xl uppercase tracking-[0.1em] hover:bg-red-700 transition-all shadow-xl mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {paying ? "Recording..." : "I have paid"}
            </button>
            
            <button onClick={() => setShowPayment(false)} className="text-gray-400 text-xs font-black uppercase tracking-widest hover:text-gray-600">
              Go Back
            </button>
          </div>
        </div>
      )}
    </main>
  );
}