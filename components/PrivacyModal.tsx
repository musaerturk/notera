
import React from 'react';

interface PrivacyModalProps {
  onAccept: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-notera-dark/80 backdrop-blur-xl animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-slide-up">
        <div className="p-12 space-y-8">
          <div className="w-20 h-20 bg-notera-turquoise/10 text-notera-turquoise rounded-3xl flex items-center justify-center mx-auto">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Veri Gizliliği ve KVKK Onayı</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              NOTERA, öğrenci sınav kağıtlarını analiz ederken verileri <span className="text-notera-purple font-bold">anonimleştirilmiş</span> kanallar üzerinden işler. Yüklediğiniz kağıtlar sadece analiz süresince kullanılır ve sunucularımızda kalıcı olarak saklanmaz.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Görüntüler işlendikten sonra tarayıcı belleğinden temizlenir.",
              "Kişisel veriler 6698 sayılı KVKK standartlarına uygun yönetilir.",
              "Yapay zeka analizleri eğitim amaçlı veri seti olarak kullanılmaz."
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-notera-turquoise">✓</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">{item}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={onAccept}
            className="w-full py-6 bg-notera-purple text-white rounded-[2rem] font-black text-sm tracking-widest uppercase shadow-xl hover:bg-notera-dark transition-all"
          >
            Anladım ve Kabul Ediyorum
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
