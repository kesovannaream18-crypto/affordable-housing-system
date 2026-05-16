'use client';
import { useState } from 'react';
import { supabase } from './lib/supabaseClient';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';

// 1. Define the data shape for TypeScript support
export interface HousingApplication {
  id: string;
  full_name: string;
  priority_score: number;
  application_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  document_url?: string;
  created_at?: string;
}

export default function CitizenPortal() {
  // --- 2. ALL HOOKS ---
  const [lang, setLang] = useState<'en' | 'kh'>('kh');
  const [fullName, setFullName] = useState('');
  const [income, setIncome] = useState('');
  const [isVictim, setIsVictim] = useState(false); // Kept in case you add a checkbox for this later
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Search & Payment States
  const [searchName, setSearchName] = useState('');
  const [searchResult, setSearchResult] = useState<HousingApplication | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paying, setPaying] = useState(false);

  // --- 3. CALCULATED LOGIC ---
  const incomeNum = Number(income) || 0;
  const isEligible = incomeNum <= 500;
  
  let score = 0;
  if (isEligible) {
    score = 20; 
    if (incomeNum < 300) score += 30;
    if (isVictim) score += 20;
  }

  // --- 4. CORE FUNCTIONS ---
  const handleSave = async () => {
    if (!fullName.trim()) return alert(lang === 'en' ? "Please enter name" : "សូមបញ្ចូលឈ្មោះ");
    
    // Optimization: Add file size validation (5MB max)
    if (file && file.size > 5 * 1024 * 1024) {
      return alert(lang === 'en' ? "File is too large (Max 5MB)" : "ឯកសារធំពេក (អតិបរមា 5MB)");
    }

    setUploading(true);

    try {
      let fileUrl = "";
      if (file) {
        // Optimization: Clean the filename to prevent URL issues
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
        const fileName = `${Date.now()}-${safeFileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('identity_docs')
          .upload(fileName, file);
        
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('identity_docs').getPublicUrl(fileName);
        fileUrl = urlData.publicUrl;
      }

      const { error: dbError } = await supabase.from('housing_applications').insert([{
        full_name: fullName.trim(),
        income: incomeNum,
        priority_score: score,
        document_url: fileUrl,
        application_status: 'PENDING'
      }]);

      if (dbError) throw dbError;

      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      alert(lang === 'en' ? "Application Submitted!" : "ពាក្យសុំត្រូវបានបញ្ជូន!");
      
      // Clear form after success
      setFullName('');
      setIncome('');
      setFile(null);

    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message); 
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = async () => {
    // Optimization: Prevent empty searches
    if (!searchName.trim()) return; 
    
    const { data, error } = await supabase.from('housing_applications')
      .select('*')
      .ilike('full_name', `%${searchName.trim()}%`)
      .maybeSingle();
    
    if (error) {
       console.error(error);
       alert("Error searching database.");
    } else if (data) {
       setSearchResult(data as HousingApplication);
    } else {
       alert(lang === 'en' ? "No record found" : "រកមិនឃើញទិន្នន័យ");
       setSearchResult(null);
    }
  };

  const recordPayment = async (appId: string) => {
    setPaying(true);
    const { error } = await supabase
      .from('payments')
      .insert([{
        application_id: appId,
        amount_paid: 150,
        month_index: new Date().getMonth() + 1
      }]);

    if (!error) {
      alert(lang === 'en' ? "Payment Successful!" : "ការបង់ប្រាក់បានជោគជ័យ!");
      setShowPayment(false);
    } else {
      alert("Error: " + error.message);
    }
    setPaying(false);
  };

  // --- 5. THE UI ---
  return (
    <main className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">MLMUPC Portal</h1>
          <button 
            onClick={() => setLang(lang === 'en' ? 'kh' : 'en')} 
            className="px-4 py-2 bg-white border-2 border-gray-100 rounded-xl shadow-sm font-bold text-blue-900"
          >
            {lang === 'en' ? 'ភាសាខ្មែរ' : 'English'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-blue-600">
            <h2 className="text-xl font-black mb-6 border-b pb-4 text-gray-800 uppercase tracking-wide">
              {lang === 'en' ? "Application Form" : "ពាក្យសុំលំនៅឋាន"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" className="w-full p-4 bg-gray-50 border-2 rounded-xl focus:border-blue-600 outline-none transition-all font-bold" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="SOK CHAN" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Monthly Income ($)</label>
                <input type="number" className="w-full p-4 bg-gray-50 border-2 rounded-xl focus:border-blue-600 outline-none transition-all font-bold" value={income} onChange={(e) => setIncome(e.target.value)} />
              </div>
              <div className="p-4 border-2 border-dashed rounded-xl bg-blue-50/50 border-blue-100">
                <label className="block text-xs font-black text-blue-900 mb-3 uppercase tracking-widest">
                  {lang === 'en' ? "Attach Identity Document" : "ភ្ជាប់ឯកសារអត្តសញ្ញាណប័ណ្ណ"}
                </label>
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm file:bg-blue-600 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2 file:font-bold file:mr-4" />
              </div>
              <button 
                onClick={handleSave} 
                disabled={uploading} 
                className="w-full py-5 bg-blue-900 text-white font-black rounded-2xl uppercase tracking-widest shadow-lg hover:bg-blue-800 transition-all active:scale-95 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : (lang === 'en' ? "Submit Record" : "រក្សាទុកទិន្នន័យ")}
              </button>
            </div>
          </div>

          {/* Decision Card */}
          <div className={`p-8 rounded-2xl shadow-xl border-t-8 transition-all duration-500 ${isEligible ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
             <h2 className="text-xl font-black mb-4 uppercase tracking-wide">{lang === 'en' ? "System Decision" : "ការសម្រេចចិត្ត"}</h2>
             <div className="text-6xl mb-4">{isEligible ? "✅" : "❌"}</div>
             <p className="text-4xl font-black mb-1">{isEligible ? "ELIGIBLE" : "NOT ELIGIBLE"}</p>
             <p className="text-lg font-bold text-gray-600">{lang === 'en' ? "Priority Score" : "ពិន្ទុអាទិភាព"}: {score}</p>
          </div>
        </div>

        {/* Search & Payment Section */}
        <div className="mt-12 bg-white p-8 rounded-2xl shadow-xl border-l-8 border-amber-500">
          <h3 className="font-black text-gray-800 text-lg mb-6 uppercase tracking-widest">{lang === 'en' ? "Track Status & Payments" : "តាមដានស្ថានភាព និងការបង់ប្រាក់"}</h3>
          <div className="flex gap-3">
            <input 
                type="text" 
                className="flex-1 p-4 border-2 bg-gray-50 rounded-xl font-black focus:border-amber-500 outline-none" 
                placeholder="Search your name..."
                value={searchName} 
                onChange={(e) => setSearchName(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
            />
            <button onClick={handleSearch} className="bg-amber-500 text-white px-10 rounded-xl font-black uppercase shadow-lg hover:bg-amber-600">Search</button>
          </div>

          {searchResult && (
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border-2 border-gray-100 animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Application Status</p>
                  <p className={`text-2xl font-black ${searchResult.application_status === 'APPROVED' ? 'text-green-600' : searchResult.application_status === 'REJECTED' ? 'text-red-600' : 'text-blue-600'}`}>
                    {searchResult.application_status}
                  </p>
                </div>
                {searchResult.application_status === 'APPROVED' && (
                  <button 
                    onClick={() => setShowPayment(true)}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-black uppercase shadow-lg hover:bg-green-700 active:scale-95 transition-all"
                  >
                    Pay Installment
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Admin Link */}
        <footer className="mt-20 py-10 text-center border-t border-gray-200">
          <a href="/admin" className="text-gray-400 hover:text-blue-900 text-sm font-bold uppercase tracking-widest">
            Ministry Official Access
          </a>
        </footer>
      </div>

      {/* KHQR PAYMENT MODAL OVERLAY */}
      {showPayment && searchResult && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-[40px] max-w-sm w-full text-center shadow-2xl border-t-8 border-red-600 animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter">KHQR Payment</h2>
            <p className="text-gray-400 text-[10px] mb-8 font-black uppercase tracking-[0.2em]">Scan with ABA or Bakong</p>
            
            <div className="bg-gray-50 p-6 rounded-3xl mb-8 flex justify-center border-2 border-gray-100">
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