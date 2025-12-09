import { useState, useEffect } from 'react';
import { budgetService } from '../service/budgetService';

interface Props { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (m: number, y: number, l: number) => void;
  suggestedBudget: number; 
}

export default function SetBudgetModal({ isOpen, onClose, onSave, suggestedBudget }: Props) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [limit, setLimit] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
        const checkExistingBudget = async () => {
            setIsLoading(true);
            try {
                const res = await budgetService.get(month, year);
                const existingLimit = Number(res.data?.limit);
                setLimit(existingLimit > 0 ? String(Math.floor(existingLimit)) : '0');
            } catch (error) {
                setLimit('0');
            } finally {
                setIsLoading(false);
            }
        };
        checkExistingBudget();
    }
  }, [isOpen, month, year]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop mờ đồng bộ */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all border border-emerald-50">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-emerald-600 text-xl">📅</span>
            <h2 className="text-2xl font-bold text-gray-900">Thiết Lập Ngân Sách</h2>
          </div>
          <p className="text-sm text-gray-500">Đặt hạn mức chi tiêu tổng để kiểm soát dòng tiền tốt hơn.</p>
        </div>

        <form onSubmit={(e) => { 
            e.preventDefault(); 
            onSave(month, year, Math.floor(Number(limit))); 
            onClose(); 
        }} className="space-y-5">
            
            {/* Chọn Thời Gian */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <label htmlFor="set-bg-month" className="mb-1.5 block text-sm font-semibold text-gray-700">Tháng</label>
                    <select 
                        id="set-bg-month" 
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" 
                        value={month} 
                        onChange={e => setMonth(Number(e.target.value))} 
                    >
                        {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>Tháng {m}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="set-bg-year" className="mb-1.5 block text-sm font-semibold text-gray-700">Năm</label>
                    <input 
                        id="set-bg-year" 
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" 
                        type="number" 
                        value={year} 
                        onChange={e => setYear(Number(e.target.value))} 
                    />
                </div>
            </div>
            
            {/* Hạn mức ngân sách */}
            <div>
                <label htmlFor="set-bg-limit" className="mb-1.5 block text-sm font-semibold text-gray-700">Tổng ngân sách dự kiến (VNĐ)</label>
                <div className="relative">
                    <input 
                        id="set-bg-limit" 
                        className={`w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 ${isLoading ? 'bg-gray-100 text-gray-400' : 'bg-gray-50'}`}
                        type="number" 
                        placeholder="Nhập số tiền..." 
                        value={limit} 
                        onChange={e => setLimit(e.target.value)} 
                        required 
                        step="1"
                        disabled={isLoading}
                    />
                    {isLoading && (
                        <div className="absolute right-3 top-3.5 flex items-center gap-1.5">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                            <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Đang tải</span>
                        </div>
                    )}
                </div>
                
                {/* Gợi ý thông minh */}
                {!isLoading && (
                  <button 
                      type="button"
                      className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors group"
                      onClick={() => setLimit(String(Math.floor(suggestedBudget)))}
                  >
                      <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 group-hover:bg-emerald-100 transition-colors">✨ Gợi ý cho tháng này:</span>
                      <span className="underline decoration-emerald-200 underline-offset-2">
                        {new Intl.NumberFormat('vi-VN').format(suggestedBudget)} ₫
                      </span>
                  </button>
                )}
            </div>

            {/* Buttons Section */}
            <div className="flex mt-8 gap-3">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-semibold text-gray-600 transition-colors hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-[0.98]"
                >
                  Lưu thiết lập
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}