
import React, { useState } from 'react';
import { PricingPlan, Campaign, AdminStats, AdminUser } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'plans' | 'campaigns'>('dashboard');

  const [users] = useState<AdminUser[]>([
    { id: 'u1', name: 'Ahmet Yılmaz', email: 'ahmet@okul.com', school: 'Atatürk Fen Lisesi', planId: '2', joinedAt: '2023-10-12', status: 'active', totalPapersRead: 1240 },
    { id: 'u2', name: 'Zeynep Kaya', email: 'zeynep@kolej.k12.tr', school: 'Özel Başarı Koleji', planId: '3', joinedAt: '2023-11-05', status: 'active', totalPapersRead: 5420 },
    { id: 'u3', name: 'Mehmet Demir', email: 'mehmet@meb.gov.tr', school: 'Cumhuriyet Ortaokulu', planId: '1', joinedAt: '2024-01-20', status: 'suspended', totalPapersRead: 12 },
    { id: 'u4', name: 'Fatma Şahin', email: 'fatma@lise.com', school: 'Anadolu Lisesi', planId: '2', joinedAt: '2024-02-15', status: 'active', totalPapersRead: 850 },
  ]);

  const [plans, setPlans] = useState<PricingPlan[]>([
    { 
      id: '1', name: 'Eğitimci Başlangıç', price: 0, currency: '₺', 
      paperLimit: 25, questionGenLimit: 5, analyticsLevel: 'basic',
      color: 'bg-slate-100 dark:bg-slate-800',
      features: ['25 Kağıt/Ay (Examora)', '5 AI Soru Üretimi', 'Temel Sınıf Analizi (EduMetrik)'] 
    },
    { 
      id: '2', name: 'Profesyonel Öğretmen', price: 249, currency: '₺', 
      paperLimit: 500, questionGenLimit: 100, analyticsLevel: 'advanced',
      color: 'bg-notera-purple',
      features: ['500 Kağıt/Ay (Examora)', 'Sınırsız Soru Tasarımı', 'Gelişmiş Kazanım Analizi', 'Excel/PDF Aktarımı'],
      isPopular: true 
    },
    { 
      id: '3', name: 'Kurumsal / Okul', price: 2499, currency: '₺', 
      paperLimit: 10000, questionGenLimit: 5000, analyticsLevel: 'institutional',
      color: 'bg-emerald-600',
      features: ['10.000 Kağıt/Ay', 'Okul Geneli Karşılaştırma', 'Yönetici Raporları', '7/24 Teknik Destek'] 
    },
  ]);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: '1', code: 'EĞİTİM2024', discount: 20, expiryDate: '2024-12-31', isActive: true, usageCount: 42 },
    { id: '2', code: 'İLKAYBEDAVA', discount: 100, expiryDate: '2024-06-01', isActive: false, usageCount: 156 },
  ]);

  const stats: AdminStats = {
    totalRevenue: 84200,
    activeUsers: 1240,
    processedPapers: 45600,
    conversions: 8.4,
    growthData: [
      { date: 'Oca', users: 400, revenue: 12000, papers: 3000 },
      { date: 'Şub', users: 600, revenue: 18000, papers: 4500 },
      { date: 'Mar', users: 850, revenue: 32000, papers: 12000 },
      { date: 'Nis', users: 1100, revenue: 54000, papers: 28000 },
      { date: 'May', users: 1240, revenue: 84200, papers: 45600 },
    ],
    moduleUsage: [
      { module: 'Examora (Sınav Okuma)', usage: 65, color: '#3B2F5B' },
      { module: 'Examora (Soru Üretim)', usage: 20, color: '#4FB6B2' },
      { module: 'EduMetrik (Analiz)', usage: 15, color: '#6366f1' },
    ]
  };

  const updatePlanPrice = (id: string, newPrice: number) => {
    setPlans(plans.map(p => p.id === id ? { ...p, price: newPrice } : p));
  };

  const toggleCampaign = (id: string) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  return (
    <div className="animate-fade-in space-y-10 pb-24">
      {/* TABS NAVIGATION */}
      <div className="flex p-2 bg-slate-900/50 backdrop-blur-md rounded-[2.5rem] border border-white/5 w-fit mx-auto shadow-2xl">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: '📊' },
          { id: 'users', label: 'Kullanıcılar', icon: '👤' },
          { id: 'plans', label: 'Modül & Paketler', icon: '💎' },
          { id: 'campaigns', label: 'Kampanyalar', icon: '🏷️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-notera-purple shadow-xl scale-105' : 'text-slate-400 hover:text-white'}`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-10">
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'MRR (Aylık Gelir)', val: `${stats.totalRevenue.toLocaleString()} ₺`, color: 'text-emerald-500', icon: '💰' },
              { label: 'Öğretmen Sayısı', val: stats.activeUsers, color: 'text-notera-purple', icon: '👨‍🏫' },
              { label: 'Okunan Kağıt', val: stats.processedPapers.toLocaleString(), color: 'text-notera-turquoise', icon: '📄' },
              { label: 'Upgrade Oranı', val: `%${stats.conversions}`, color: 'text-indigo-500', icon: '🚀' }
            ].map((s, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                  <span className="text-xl">{s.icon}</span>
                </div>
                <div className={`text-4xl font-black ${s.color} tracking-tighter`}>{s.val}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* GROWTH CHART */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-xl">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                📈 Sistem Büyüme Trendi (Examora Kullanımı)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.growthData}>
                    <defs>
                      <linearGradient id="colorPapers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4FB6B2" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4FB6B2" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000008" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                    <Tooltip contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="papers" stroke="#4FB6B2" fillOpacity={1} fill="url(#colorPapers)" strokeWidth={4} />
                    <Area type="monotone" dataKey="revenue" stroke="#3B2F5B" fillOpacity={0} strokeWidth={4} strokeDasharray="8 8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* MODULE USAGE - DONUT */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-xl">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-8">
                🧩 Modül Tercihleri
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.moduleUsage}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={8}
                      dataKey="usage"
                    >
                      {stats.moduleUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 space-y-3">
                {stats.moduleUsage.map((m, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: m.color}}></div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{m.module}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white">%{m.usage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="space-y-8 animate-slide-up">
          <div className="bg-notera-purple p-10 rounded-[3rem] text-white flex flex-col md:row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-3xl font-black uppercase tracking-tighter">Modül Fiyatlandırma Stratejisi</h3>
              <p className="text-indigo-200 font-medium">Examora (Okuma) birim maliyet, EduMetrik (Analiz) ise paket değeri üzerinden fiyatlandırılır.</p>
            </div>
            <button className="px-8 py-4 bg-notera-turquoise text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg">Yeni Paket Oluştur +</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map(plan => (
              <div key={plan.id} className={`bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border-4 transition-all hover:scale-[1.02] ${plan.isPopular ? 'border-notera-turquoise' : 'border-slate-100 dark:border-slate-800'}`}>
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{plan.name}</h4>
                  {plan.isPopular && <span className="px-3 py-1 bg-notera-turquoise text-white rounded-lg text-[8px] font-black uppercase tracking-widest">EN ÇOK TERCİH EDİLEN</span>}
                </div>
                
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl font-black text-notera-purple dark:text-white">{plan.price}</span>
                  <span className="text-xl font-bold text-slate-400">{plan.currency} <span className="text-xs">/ Ay</span></span>
                </div>

                <div className="space-y-4 mb-10">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">EXAMORA LİMİTİ</span>
                    <div className="text-lg font-black text-notera-purple dark:text-notera-turquoise">{plan.paperLimit} Kağıt / Ay</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">EDUMETRİK SEVİYESİ</span>
                    <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">{plan.analyticsLevel} Analiz</div>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 border-t border-slate-100 dark:border-slate-800 pt-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-500">
                      <span className="text-notera-turquoise mt-1">✓</span> {f}
                    </li>
                  ))}
                </ul>
                
                <div className="flex gap-3">
                  <button className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-notera-purple hover:text-white transition-all">Düzenle</button>
                  <button className="flex-1 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Pasif Yap</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden animate-slide-up">
          <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Aktif Kullanıcı Havuzu</h3>
            <div className="flex gap-4">
              <input type="text" placeholder="E-posta veya Okul ara..." className="px-6 py-3 bg-white dark:bg-slate-800 rounded-xl text-xs outline-none border border-slate-200 dark:border-slate-700 focus:border-notera-purple transition-all w-64 shadow-inner" />
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-10 py-6">Kullanıcı / Kurum</th>
                <th className="px-10 py-6">Aktif Paket</th>
                <th className="px-10 py-6">Okuma Trafiği</th>
                <th className="px-10 py-6">Kayıt Tarihi</th>
                <th className="px-10 py-6 text-right">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group">
                  <td className="px-10 py-8">
                    <div className="font-black text-slate-900 dark:text-white mb-0.5">{user.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user.school}</div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase border border-indigo-100 dark:border-indigo-900/50">
                      {plans.find(p => p.id === user.planId)?.name}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="font-black text-lg text-slate-700 dark:text-slate-300">{user.totalPapersRead}</div>
                    <div className="w-24 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-notera-turquoise" style={{width: `${Math.min(100, (user.totalPapersRead / 500) * 100)}%`}}></div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-xs font-bold text-slate-500">{new Date(user.joinedAt).toLocaleDateString('tr-TR')}</td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <span className={`w-2.5 h-2.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)] animate-pulse'}`}></span>
                      <button className="p-2 text-slate-300 hover:text-notera-purple transition-all opacity-0 group-hover:opacity-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
          {campaigns.map(c => (
            <div key={c.id} className={`p-10 rounded-[3rem] border-4 transition-all bg-white dark:bg-slate-900 ${c.isActive ? 'border-emerald-500/20' : 'border-slate-100 dark:border-slate-800 grayscale opacity-50'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <div className="text-4xl font-black text-slate-900 dark:text-white tracking-[0.2em]">{c.code}</div>
                  <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">%{c.discount} İndirim Kampanyası</div>
                </div>
                <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase">AKTİF</div>
              </div>
              <div className="flex items-center gap-6 text-xs font-bold text-slate-400 mb-8">
                <span>📅 {c.expiryDate}</span>
                <span>🔥 {c.usageCount} Kullanım</span>
              </div>
              <button 
                onClick={() => toggleCampaign(c.id)}
                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${c.isActive ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white' : 'bg-emerald-500 text-white'}`}
              >
                {c.isActive ? 'KAMPANYAYI DURDUR' : 'YAYINA AL'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
