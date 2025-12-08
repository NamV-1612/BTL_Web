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
        // SỬA: Dùng Math.floor để hiển thị số nguyên
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
          // SỬA: Lưu số nguyên
          onSave(expense.id, category, Math.floor(Number(amount)), date, note);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Sửa Giao Dịch</h2>
        <form onSubmit={handleSubmit}>
            
            <div className="mb-3">
                <label htmlFor="edit-exp-category" className="block text-sm text-gray-600 mb-1">
                  Danh mục
                </label>
                {expense.type === 'expense' ? (
                     <select 
                        id="edit-exp-category"
                        className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" 
                        value={category} 
                        onChange={e => setCategory(e.target.value)}
                        title="Chọn danh mục"
                    >
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                ) : (
                    <input 
                        id="edit-exp-category"
                        className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" 
                        value={category} 
                        onChange={e => setCategory(e.target.value)} 
                        placeholder="Nhập nguồn thu..."
                        title="Nhập danh mục hoặc nguồn thu"
                    />
                )}
            </div>

            <div className="mb-3">
                <label htmlFor="edit-exp-amount" className="block text-sm text-gray-600 mb-1">
                  Số tiền
                </label>
                <input 
                    id="edit-exp-amount"
                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" 
                    type="number" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    required 
                    placeholder="Nhập số tiền..."
                    title="Nhập số tiền"
                    step="1"
                />
            </div>

            <div className="mb-3">
                <label htmlFor="edit-exp-date" className="block text-sm text-gray-600 mb-1">
                  Ngày
                </label>
                <input 
                    id="edit-exp-date"
                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    required 
                    title="Chọn ngày giao dịch"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="edit-exp-note" className="block text-sm text-gray-600 mb-1">
                  Ghi chú
                </label>
                <input 
                    id="edit-exp-note"
                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" 
                    value={note} 
                    onChange={e => setNote(e.target.value)} 
                    placeholder="Nhập ghi chú..."
                    title="Nhập ghi chú"
                />
            </div>

            <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">Hủy</button>
                <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Cập nhật</button>
            </div>
        </form>
      </div>
    </div>
  );
} 