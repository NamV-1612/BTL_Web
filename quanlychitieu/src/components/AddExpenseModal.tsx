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

  // --- SỬA LOGIC TẠI ĐÂY ---
  useEffect(() => {
    if (isOpen) {
        if (type === 'expense' && categories.length > 0) {
            // Nếu là Chi tiêu: Tự động chọn danh mục đầu tiên
            setCategory(categories[0].name);
        } else if (type === 'income') {
            // Nếu là Thu nhập: Để trống ô nhập liệu
            setCategory('');
        }
    }
  }, [isOpen, type, categories]);

  const warning = useMemo(() => {
    if (type !== 'expense' || !category) return null;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Ghi Giao Dịch Mới</h2>
        
        <div className="flex mb-4 gap-2">
            <button 
                type="button" 
                onClick={() => setType('expense')} 
                className={`flex-1 py-2 rounded font-bold transition-colors ${type === 'expense' ? 'bg-red-100 text-red-600 ring-2 ring-red-400' : 'bg-gray-100 text-gray-500'}`}
            >
                CHI TIÊU
            </button>
            <button 
                type="button" 
                onClick={() => setType('income')} 
                className={`flex-1 py-2 rounded font-bold transition-colors ${type === 'income' ? 'bg-green-100 text-green-600 ring-2 ring-green-400' : 'bg-gray-100 text-gray-500'}`}
            >
                THU NHẬP
            </button>
        </div>

        <form onSubmit={(e) => { 
            e.preventDefault(); 
            onAdd(type, category, Math.floor(Number(amount)), date, note); 
            setAmount(''); setNote(''); 
        }}>
            <div className="mb-3">
                <label htmlFor="add-exp-cat" className="block text-sm text-gray-600 mb-1">Danh mục / Nguồn tiền</label>
                {type === 'expense' ? (
                    <select 
                        id="add-exp-cat" 
                        className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" 
                        value={category} 
                        onChange={e => setCategory(e.target.value)} 
                        title="Chọn danh mục"
                    >
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                ) : (
                    <input 
                        id="add-exp-cat" 
                        className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="Ví dụ: Lương, Thưởng..." 
                        value={category} 
                        onChange={e => setCategory(e.target.value)} 
                        required 
                        title="Nhập nguồn tiền"
                    />
                )}
            </div>
            
            <div className="mb-2">
                <label htmlFor="add-exp-amount" className="block text-sm text-gray-600 mb-1">Số tiền</label>
                <input 
                    id="add-exp-amount" 
                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" 
                    type="number" 
                    placeholder="Ví dụ: 50000" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    required 
                    title="Nhập số tiền" 
                    step="1"
                />
            </div>
            
            {warning && <div className="mb-3 p-3 bg-orange-50 text-orange-800 text-sm rounded border border-orange-200">⚠️ Cảnh báo vượt hạn mức!</div>}

            <div className="mb-3">
                <label htmlFor="add-exp-date" className="block text-sm text-gray-600 mb-1">Ngày giao dịch</label>
                <input 
                    id="add-exp-date" 
                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    required 
                    title="Chọn ngày"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="add-exp-note" className="block text-sm text-gray-600 mb-1">Ghi chú</label>
                <input 
                    id="add-exp-note" 
                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Ghi chú..." 
                    value={note} 
                    onChange={e => setNote(e.target.value)} 
                    title="Nhập ghi chú"
                />
            </div>
            
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">Hủy</button>
                <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Lưu</button>
            </div>
        </form>
      </div>
    </div>
  );
}