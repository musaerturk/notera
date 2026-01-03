
import React, { useState } from 'react';

interface AboutViewProps {
  onStart: () => void;
}

const AboutView: React.FC<AboutViewProps> = ({ onStart }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    { q: "NOTERA el yazısını gerçekten okuyabilir mi?", a: "Evet. Gelişmiş AI motorumuz, farklı el yazısı stillerini yüksek doğrulukla metne döker ve öğretmenlerimizin kontrolüne sunar." },
    { q: "Sadece doğru/yanlış mı kontrol ediyor?", a: "Hayır. NOTERA anlam bazlı analiz yapar. Öğrencinin cümleyi nasıl kurduğuna değil, vermek istediği mesajın rubrikle olan anlamsal bağına odaklanır." },
    { q: "Güven skoru nedir?", a: "AI her okumada kendine ne kadar güvendiğini belirtir. Düşük güvenli okumaları NOTERA sizin için işaretler, böylece hiçbir detayı gözden kaçırmazsınız." }
  ];

  const comparisonTable = [
    { k: 'Sınav Hazırlama', n: '✅ Kazanım odaklı, AI destekli', r: '⚠️ Hazır havuz, sınırlı' },
    { k: 'Yazılı Okuma', n: '✅ Foto / PDF, açık uçlu dahil', r: '❌ Yok / Sadece test' },
    { k: 'Açık Uçlu Değerlendirme', n: '✅ Var (Öğretmen Onaylı)', r: '❌ Yok' },
    { k: 'Kazanım Analizi', n: '✅ Otomatik ve net', r: '⚠️ Sınırlı' },
    { k: 'Öğretmen Kontrolü', n: '✅ Son karar öğretmende', r: '⚠️ Kısıtlı' }
  ];

  return (
    <div className="animate-fade-in pb-20 max-w-5xl mx-auto space-y-24">
      {/* Hero Section */}
      <div className="relative p-12 md:p-24 bg-notera-purple rounded-[4rem] shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-notera-turquoise/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
        <div className="relative z-10 text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
            <span className="w-2.5 h-2.5 bg-notera-turquoise rounded-full animate-pulse"></span>
            <span className="text-xs font-black text-white uppercase tracking-[0.3em]">Değerlendirmenin Akıllı Yolu</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none uppercase">
            N<span className="logo-o">O</span>TERA
          </h1>
          <p className="text-2xl md:text-3xl text-slate-200 font-medium max-w-3xl mx-auto leading-relaxed">
            Sınavı sadece okuyan değil; sınavdan <span className="text-notera-turquoise font-black italic border-b-4 border-notera-turquoise/30">anlam çıkaran</span> akıllı asistanınız.
          </p>
          <div className="pt-6">
            <button 
              onClick={onStart}
              className="px-16 py-7 bg-notera-turquoise text-white rounded-[2rem] font-black text-xl tracking-widest uppercase shadow-2xl hover:bg-[#45a19d] transition-all hover:scale-105 active:scale-95"
            >
              Ücretsiz Dene
            </button>
          </div>
        </div>
      </div>

      {/* Brand Story Trio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Hazırla', sub: 'EXAMORA', icon: '✏️', desc: 'Soruyu öğretmenle birlikte hazırlar, kazanım odaklı kurgu yapar.' },
          { title: 'Analiz Et', sub: 'EDUMETRİK', icon: '📊', desc: 'Notları anlamlandırır, gelişim alanlarını tek bakışta gösterir.' },
          { title: 'Güçlendir', sub: 'REHBERLİK', icon: '🤝', desc: 'Öğretmenin yerine geçmez, öğretmenin kararını destekler.' }
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
            <div className="text-5xl mb-8 group-hover:scale-110 transition-transform">{item.icon}</div>
            <h3 className="text-xs font-black text-notera-turquoise uppercase tracking-[0.3em] mb-3">{item.sub}</h3>
            <h4 className="text-3xl font-black text-notera-purple dark:text-white uppercase tracking-tighter mb-4">{item.title}</h4>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Official MEB Statement */}
      <div className="bg-slate-50 dark:bg-slate-900/40 p-12 md:p-20 rounded-[4rem] border border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-notera-purple dark:text-notera-turquoise uppercase tracking-[0.5em]">RESMİ ÇERÇEVE</h3>
            <h4 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Eğitimde Veri Rehberliği</h4>
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-6 font-medium leading-relaxed">
            <p>NOTERA, öğretmenlerin ölçme ve değerlendirme süreçlerini desteklemek amacıyla geliştirilmiş yapay zekâ tabanlı bir eğitim teknolojisi platformudur.</p>
            <p>Platform; öğretmen tarafından hazırlanan ya da sisteme yüklenen sınavları analiz ederek, öğrenci cevaplarını objektif ölçütlere göre değerlendirmeyi ve kazanım temelli raporlar üretmeyi amaçlar.</p>
            <p className="p-8 bg-notera-purple text-white rounded-3xl font-bold italic shadow-lg">"NOTERA, öğretmenin pedagojik kararlarının yerine geçmez; öğretmene rehberlik eden bir destek aracı olarak tasarlanmıştır. Nihai değerlendirme yetkisi her zaman öğretmendedir."</p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-12 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
           <h3 className="text-2xl font-black text-notera-purple dark:text-white uppercase tracking-tight">Neden NOTERA?</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white dark:bg-slate-900 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-12 py-6">Kriter</th>
                <th className="px-12 py-6 text-notera-turquoise">NOTERA</th>
                <th className="px-12 py-6">Diğer Sistemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {comparisonTable.map((row, i) => (
                <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                  <td className="px-12 py-8 font-black text-slate-700 dark:text-slate-300">{row.k}</td>
                  <td className="px-12 py-8 font-bold text-notera-purple dark:text-notera-turquoise">{row.n}</td>
                  <td className="px-12 py-8 font-medium text-slate-400">{row.r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-12">
        <h3 className="text-3xl font-black text-notera-purple dark:text-white uppercase tracking-tight text-center">Merak Edilenler</h3>
        <div className="grid grid-cols-1 gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-8 flex items-center justify-between text-left"
              >
                <span className="font-bold text-xl text-slate-700 dark:text-slate-200">{faq.q}</span>
                <span className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 transition-transform ${activeFaq === idx ? 'rotate-180 bg-notera-turquoise text-white' : ''}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </button>
              {activeFaq === idx && (
                <div className="p-8 pt-0 text-slate-500 dark:text-slate-400 font-medium leading-relaxed animate-slide-up">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-20">
        <p className="text-notera-purple dark:text-notera-turquoise font-black uppercase tracking-[0.5em] mb-4">NOTERA</p>
        <h5 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Not değil, içgörü üretir.</h5>
      </div>
    </div>
  );
};

export default AboutView;
