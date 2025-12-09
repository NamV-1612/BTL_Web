import { useState, useEffect } from 'react';

interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
  note: string;
  type: string;
}

interface Category {
  id: number;
  name: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  onSave: (id: number, cat: string, amt: number, date: string, note: string) => void;
  categories: Category[];
}

export default function EditExpenseModal({ isOpen, onClose, expense, onSave, categories }: Props) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (expense) {
        setCategory(expense.category);
        setAmount(String(Math.floor(expense.amount)));
        try {
            setDate(new Date(expense.date).toISOString().split('T')[0]);
        } catch {
            setDate('');
        }
        setNote(expense.note || '');
    }
  }, [expense, isOpen]);

  if (!isOpen || !expense) return null;

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (expense) {
          onSave(expense.id, category, Math.floor(Number(amount)), date, note);
          onClose();
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop blur đồng bộ */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all border border-emerald-50">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-emerald-600 text-xl">✍️</span>
            <h2 className="text-2xl font-bold text-gray-900">Sửa Giao Dịch</h2>
          </div>
          <p className="text-sm text-gray-500">
            Bạn đang chỉnh sửa khoản <strong>{expense.type === 'expense' ? 'chi tiêu' : 'thu nhập'}</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Input: Category / Source */}
            <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    {expense.type === 'expense' ? 'Danh mục' : 'Nguồn thu'}
                </label>
                {expense.type === 'expense' ? (
                    <select 
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" 
                        value={category} 
                        onChange={e => setCategory(e.target.value)}
                    >
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                ) : (
                    <input 
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" 
                        value={category} 
                        onChange={e => setCategory(e.target.value)} 
                        placeholder="Nhập nguồn thu..."
                        required
                    />
                )}
            </div>

            {/* Input: Amount */}
            <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Số tiền (VNĐ)</label>
                <input 
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" 
                    type="number" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    required 
                    placeholder="0"
                    step="1"
                />
            </div>

            {/* Input: Date */}
            <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Ngày giao dịch</label>
                <input 
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    required 
                />
            </div>

            {/* Input: Note */}
            <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Ghi chú</label>
                <input 
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" 
                    value={note} 
                    onChange={e => setNote(e.target.value)} 
                    placeholder="Thêm chi tiết..."
                />
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
                  Cập nhật
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}