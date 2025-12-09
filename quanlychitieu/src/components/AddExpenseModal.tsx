import { useState, useEffect, useMemo } from 'react';

interface Props { 
  isOpen: boolean; 
  onClose: () => void; 
  onAdd: (type: any, cat: string, amt: number, date: string, note: string) => void; 
  categories: any[]; 
  expenses: any[]; 
}

export default function AddExpenseModal({ isOpen, onClose, onAdd, categories, expenses }: Props) {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (type === 'expense' && categories.length > 0) {
        setCategory(categories[0].name);
      } else if (type === 'income') {
        setCategory('');
      }
    }
  }, [isOpen, type, categories]);

  const warning = useMemo(() => {
    if (type !== 'expense' || !category || !amount) return null;
    const cat = categories.find(c => c.name === category);
    if (!cat || cat.limit === 0) return null;
    
    const inputDate = new Date(date);
    const spent = expenses
        .filter(e => e.type === 'expense' && e.category === category && new Date(e.date).getMonth() === inputDate.getMonth())
        .reduce((sum, e) => sum + Number(e.amount), 0);
    
    const newTotal = spent + Number(amount);
    if (newTotal > cat.limit) return { limit: cat.limit, spent, newTotal };
    return null;
  }, [category, amount, date, type, categories, expenses]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(type, category, Math.floor(Number(amount)), date, note);
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all border border-emerald-50">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">✨ Ghi Giao Dịch</h2>
        
        {/* Toggle Type */}
        <div className="flex mb-6 p-1 bg-gray-100 rounded-xl">
            <button 
                type="button" 
                onClick={() => setType('expense')} 
                className={`flex-1 py-2.5 rounded-lg font-bold transition-all ${type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                CHI TIÊU
            </button>
            <button 
                type="button" 
                onClick={() => setType('income')} 
                className={`flex-1 py-2.5 rounded-lg font-bold transition-all ${type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                THU NHẬP
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category / Source */}
            <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    {type === 'expense' ? 'Danh mục chi tiêu' : 'Nguồn tiền thu nhập'}
                </label>
                {type === 'expense' ? (
                    <select 
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-all" 
                        value={category} 
                        onChange={e => setCategory(e.target.value)} 
                    >
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                ) : (
                    <input 
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-all" 
                        placeholder="Ví dụ: Lương, Freelance..." 
                        value={category} 
                        onChange={e => setCategory(e.target.value)} 
                        required 
                    />
                )}
            </div>
            
            {/* Amount */}
            <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Số tiền (VNĐ)</label>
                <input 
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-all" 
                    type="number" 
                    placeholder="0" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    required 
                    step="1"
                />
            </div>
            
            {/* Warning Section */}
            {warning && (
                <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-xl border border-amber-200 animate-pulse">
                    ⚠️ <strong>Cảnh báo:</strong> Giao dịch này sẽ khiến mục "{category}" vượt hạn mức tháng (Tối đa: {warning.limit.toLocaleString()}đ).
                </div>
            )}

            {/* Date */}
            <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Ngày giao dịch</label>
                <input 
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-all" 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    required 
                />
            </div>

            {/* Note */}
            <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Ghi chú</label>
                <input 
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-all" 
                    placeholder="Mua sắm gì đó..." 
                    value={note} 
                    onChange={e => setNote(e.target.value)} 
                />
            </div>
            
            {/* Actions */}
            <div className="flex mt-8 gap-3">
                <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-semibold text-gray-600 hover:bg-gray-200 transition-all">Hủy</button>
                <button type="submit" className="flex-[2] rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all">Lưu giao dịch</button>
            </div>
        </form>
      </div>
    </div>
  );
}