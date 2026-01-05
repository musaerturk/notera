
import React, { useState } from 'react';
import { PricingPlan } from '../types';

interface CheckoutViewProps {
  plan: PricingPlan;
  onCancel: () => void;
  onSuccess: () => void;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ plan, onCancel, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simülasyon: 2 saniye bekle ve başarıyla sonuçlandır
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  const inputClasses = "w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-notera-purple rounded-2xl outline-none transition-all font-bold text-lg text-slate-800 dark:text-white";
  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2";

  return (
    <div className="animate-fade-in max-w-5xl mx-auto py-12 flex flex-col lg:flex-row gap-12">
      {/* SOL: ÖDEME FORMU */}
      <div className="flex-1 space-y-8">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase hover:text-notera-purple transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          Planlara Geri Dön
        </button>

        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M21 4H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.11-.9-2-2-2zm0 14H3V6h18v12zm-9-7H5v2h7v-2zm-4 4H5v2h3v-2zm8-4h-3v2h3v-2zm0 4h-3v2h3v-2z"/></svg>
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-10">Güvenli Ödeme Detayları</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Ad Soyad</label>
                <input type="text" placeholder="Kart Üzerindeki İsim" className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>E-Posta</label>
                <input type="email" placeholder="Fatura adresi" className={inputClasses} required />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Kart Numarası</label>
              <div className="relative">
                <input type="text" placeholder="0000 0000 0000 0000" className={inputClasses} required />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                  <div className="w-8 h-5 bg-slate-200 rounded-sm"></div>
                  <div className="w-8 h-5 bg-slate-200 rounded-sm"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Son Kullanma</label>
                <input type="text" placeholder="AA / YY" className={inputClasses} required />
              </div>
              <div>
                <label className={labelClasses}>CVC</label>
                <input type="text" placeholder="123" className={inputClasses} required />
              </div>
            </div>

            <div className="pt-6">
              <button 
                disabled={isProcessing}
                className="w-full py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-sm tracking-widest uppercase shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    İŞLENİYOR...
                  </>
                ) : (
                  <>ÖDEMEYİ TAMAMLA ({plan.price} {plan.currency})</>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-center justify-center gap-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Banka seviyesinde (AES-256) şifreleme aktif</p>
          </div>
        </div>
      </div>

      {/* SAĞ: ÖZET */}
      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-notera-purple p-10 rounded-[3rem] text-white shadow-xl space-y-6">
           <h3 className="text-xs font-black text-notera-turquoise uppercase tracking-[0.3em]">Sipariş Özeti</h3>
           <div className="space-y-2">
              <p className="text-xl font-black uppercase leading-tight">{plan.name}</p>
              <p className="text-xs font-medium text-slate-300">Aylık Abonelik</p>
           </div>
           
           <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex justify-between text-xs font-bold">
                 <span className="text-slate-400 uppercase">Ara Toplam</span>
                 <span>{plan.price} {plan.currency}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                 <span className="text-slate-400 uppercase">Vergi (KDV %20)</span>
                 <span>Dahil</span>
              </div>
              <div className="flex justify-between pt-4 text-2xl font-black">
                 <span className="uppercase tracking-tighter">TOPLAM</span>
                 <span>{plan.price} {plan.currency}</span>
              </div>
           </div>
        </div>

        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Para İade Garantisi</p>
                 <p className="text-[9px] font-bold text-slate-400">İlk 14 gün koşulsuz iade.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
