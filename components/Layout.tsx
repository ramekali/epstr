
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-emerald-700 text-white shadow-lg no-print">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-black mb-2 tracking-tight">مولد الأهداف التعلمية الذكي</h1>
          <p className="text-emerald-100 text-lg">منهاج التربية البدنية والرياضية - الطور الابتدائي الجزائري (2023)</p>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-slate-200 text-slate-600 py-6 text-center text-sm no-print">
        <p>© 2024 مساعد المعلم الجزائري - التربية البدنية</p>
      </footer>
    </div>
  );
};
