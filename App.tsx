
import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { CURRICULUM_DATA } from './constants';
import { GradeData, Field } from './types';
import { generateObjectives } from './geminiService';

const App: React.FC = () => {
  const [selectedGradeIndex, setSelectedGradeIndex] = useState<number | null>(null);
  const [selectedFieldName, setSelectedFieldName] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [objectives, setObjectives] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedGrade: GradeData | undefined = useMemo(() => {
    return selectedGradeIndex !== null ? CURRICULUM_DATA.curriculum_data[selectedGradeIndex] : undefined;
  }, [selectedGradeIndex]);

  const selectedField: Field | undefined = useMemo(() => {
    return selectedGrade?.fields.find(f => f.field_name === selectedFieldName);
  }, [selectedGrade, selectedFieldName]);

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedGradeIndex(val === '' ? null : parseInt(val));
    setSelectedFieldName('');
    setSelectedResource('');
    setObjectives([]);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFieldName(e.target.value);
    setSelectedResource('');
    setObjectives([]);
  };

  const handleGenerate = async () => {
    if (!selectedGrade || !selectedField || !selectedResource) return;

    setLoading(true);
    setError(null);
    try {
      const result = await generateObjectives(
        selectedGrade.grade_name,
        selectedField.final_competence,
        selectedResource,
        selectedGrade.overall_competence
      );
      setObjectives(result);
    } catch (err) {
      setError('حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Selection Card */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 no-print">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">📋</span>
            تحديد معطيات الدرس
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-600">المستوى الدراسي</label>
              <select 
                value={selectedGradeIndex ?? ''} 
                onChange={handleGradeChange}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              >
                <option value="">اختر السنة...</option>
                {CURRICULUM_DATA.curriculum_data.map((g, idx) => (
                  <option key={idx} value={idx}>{g.grade_name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-600">الميدان (الكفاءة الختامية)</label>
              <select 
                value={selectedFieldName} 
                onChange={handleFieldChange}
                disabled={!selectedGrade}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
              >
                <option value="">اختر الميدان...</option>
                {selectedGrade?.fields.map((f, idx) => (
                  <option key={idx} value={f.field_name}>{f.field_name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-600">المورد المعرفي</label>
              <select 
                value={selectedResource} 
                onChange={(e) => setSelectedResource(e.target.value)}
                disabled={!selectedField}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
              >
                <option value="">اختر المورد...</option>
                {selectedField?.knowledge_resources.map((r, idx) => (
                  <option key={idx} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={!selectedResource || loading}
              className={`px-8 py-3 rounded-xl font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg
                ${!selectedResource || loading 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري التوليد...
                </span>
              ) : 'توليد 20 هدفاً تعلمياً'}
            </button>
          </div>
        </section>

        {/* Display Meta Data Info (No Print) */}
        {selectedGrade && !loading && objectives.length === 0 && (
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 no-print">
            <h3 className="text-blue-800 font-bold mb-2">الكفاءة الشاملة للمستوى:</h3>
            <p className="text-blue-700 leading-relaxed">{selectedGrade.overall_competence}</p>
            {selectedField && (
              <div className="mt-4">
                <h3 className="text-blue-800 font-bold mb-1">الكفاءة الختامية:</h3>
                <p className="text-blue-700">{selectedField.final_competence}</p>
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {objectives.length > 0 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center no-print">
              <h2 className="text-2xl font-black text-slate-800">الأهداف التعلمية المقترحة</h2>
              <button 
                onClick={handlePrint}
                className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <span>🖨️</span> طباعة / حفظ PDF
              </button>
            </div>

            {/* Print Header */}
            <div className="hidden print:block text-center border-b-2 border-slate-800 pb-4 mb-8">
              <h1 className="text-2xl font-bold">بطاقة الأهداف التعلمية - التربية البدنية والرياضية</h1>
              <div className="grid grid-cols-2 mt-4 text-right text-lg gap-4">
                <p><strong>المستوى:</strong> {selectedGrade?.grade_name}</p>
                <p><strong>الميدان:</strong> {selectedFieldName}</p>
                <p className="col-span-2"><strong>المورد المعرفي:</strong> {selectedResource}</p>
                <p className="col-span-2"><strong>الكفاءة الختامية:</strong> {selectedField?.final_competence}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {objectives.map((obj, index) => (
                <div 
                  key={index} 
                  className="objective-card bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex gap-4 items-start"
                >
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-sm">
                    {index + 1}
                  </span>
                  <p className="text-slate-800 text-lg leading-relaxed">{obj}</p>
                </div>
              ))}
            </div>
            
            <div className="hidden print:block pt-10 text-left italic">
              <p>توقيع الأستاذ: ....................................</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-center">
            {error}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
