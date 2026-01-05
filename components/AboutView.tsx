
import React, { useState } from 'react';

interface AboutViewProps {
  onStart: () => void;
}

const AboutView: React.FC<AboutViewProps> = ({ onStart }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    { q: "NOTERA el yazısını gerçekten okuyabilir mi?", a: "Evet. Gemini-3 vision teknolojisi sayesinde, farklı el yazısı stillerini %95'e varan doğrulukla metne döker ve her zaman öğretmen onayına sunar." },
    { q: "Puanlama kriterlerini kendim belirleyebilir miyim?", a: "Kesinlikle. Her soru için 'Rubrik' dediğimiz puanlama basamaklarını tanımlayabilirsiniz. AI, bu kriterleri harfiyen uygular." },
    { q: "KVKK ve veri güvenliği konusunda durum nedir?", a: "NOTERA, verileri doğrudan tarayıcıda ve güvenli AI kanallarında işler. Kredi kartı gibi hassas bilgiler asla sistemimizde saklanmaz, PCI-DSS uyumlu altyapılar kullanılır." }
  ];

  return (
    <div className="animate-fade-in pb-20 max-w-6xl mx-auto space-y-24 pt-10">
      {/* Hero Section */}
      <div className="relative p-12 md:p-24 bg-notera-purple rounded-[4rem] shadow-2xl overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-notera-turquoise/20 rounded-full -translate-y-1/2 translate-x-1/3 blur-[120px] pointer-events-none"></div>
        <div className="relative z-10 text-center space-y-12">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-md animate-float">
            <span className="w-2.5 h-2.5 bg-notera-turquoise rounded-full shadow-[0_0_10px_#4FB6B2]"></span>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Değerlendirmenin Geleceği Burada</span>
          </div>
          <h1 className="text-8xl md:text-[10rem] font-black text-white tracking-tighter leading-none uppercase">
            N<span className="logo-o">O</span>TERA
          </h1>
          <p className="text-2xl md:text-3xl text-slate-200 font-medium max-w-3xl mx-auto leading-relaxed">
            Klasik sınav okuma derdine son. <span className="text-notera-turquoise font-black italic">Yapay zeka</span> destekli, kazanım odaklı ölçme asistanınız.
          </p>
          <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onStart}
              className="px-20 py-8 bg-notera-turquoise text-white rounded-[2.5rem] font-black text-xl tracking-widest uppercase shadow-[0_20px_40px_rgba(79,182,178,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
              Hemen Başla
            </button>
            <div className="text-left">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Hızlı Erişim</p>
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 text-xs">AI</div>
                 <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 text-xs">PDF</div>
                 <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 text-xs">📊</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Trio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { title: 'Examora', sub: 'HAZIRLA & OKU', icon: '✏️', desc: 'Kazanımlara göre soru üretir, el yazısı kağıtları saniyeler içinde puanlar.' },
          { title: 'EduMetrik', sub: 'ANALİZ & RAPOR', icon: '📉', desc: 'Notları grafiklere döker, her öğrenciye özel gelişim karnesi sunar.' },
          { title: 'Güvenli Altyapı', sub: 'ETİK & GİZLİLİK', icon: '🛡️', desc: 'Öğrenci verilerini anonimleştirir, öğretmene tam denetim yetkisi verir.' }
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900/50 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group">
            <div className="text-5xl mb-10 p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl w-fit group-hover:bg-notera-turquoise group-hover:text-white transition-colors">{item.icon}</div>
            <h3 className="text-xs font-black text-notera-turquoise uppercase tracking-[0.4em] mb-3">{item.sub}</h3>
            <h4 className="text-3xl font-black text-notera-purple dark:text-white uppercase tracking-tighter mb-5">{item.title}</h4>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Comparison & FAQ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-slate-900 p-12 rounded-[4rem] text-white space-y-10 shadow-2xl">
           <h3 className="text-[10px] font-black text-notera-turquoise uppercase tracking-[0.4em]">NEDEN BİZ?</h3>
           <h4 className="text-4xl font-black uppercase tracking-tighter">Klasik Yöntem vs NOTERA</h4>
           <div className="space-y-6">
              {[
                { k: 'Zaman Tasarrufu', v: '%80 Daha Hızlı' },
                { k: 'Puanlama Şeffaflığı', v: 'Rubrik Odaklı Gerekçe' },
                { k: 'Hata Payı', v: 'Kontrol Edilebilir AI' },
                { k: 'Analiz Derinliği', v: 'Bireysel Gelişim Karnesi' }
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-white/5">
                   <span className="font-bold text-slate-400">{row.k}</span>
                   <span className="font-black text-notera-turquoise">{row.v}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight ml-4">Sıkça Sorulanlar</h3>
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-8 flex items-center justify-between text-left group"
              >
                <span className="font-black text-lg text-slate-700 dark:text-slate-200 group-hover:text-notera-purple transition-colors uppercase tracking-tight">{faq.q}</span>
                <span className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeFaq === idx ? 'bg-notera-purple text-white rotate-180' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </button>
              {activeFaq === idx && (
                <div className="p-10 pt-0 text-slate-500 dark:text-slate-400 font-bold leading-relaxed text-lg animate-slide-up">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutView;
