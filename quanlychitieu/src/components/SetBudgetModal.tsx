import { useState, useEffect } from 'react';
import { budgetService } from '../service/budgetService'; // Import service để check dữ liệu cũ

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

  // LOGIC MỚI: Mỗi khi đổi Tháng/Năm hoặc mở Modal -> Kiểm tra xem tháng đó đã set tiền chưa
  useEffect(() => {
    if (isOpen) {
        const checkExistingBudget = async () => {
            setIsLoading(true);
            try {
                // Gọi API lấy ngân sách của tháng đang chọn
                const res = await budgetService.get(month, year);
                const existingLimit = Number(res.data?.limit);

                if (existingLimit > 0) {
                    // Nếu đã từng cài -> Điền số đó vào
                    setLimit(String(Math.floor(existingLimit)));
                } else {
                    // Nếu chưa cài -> Mặc định là 0 (Đúng ý bạn)
                    setLimit('0');
                }
            } catch (error) {
                // Nếu lỗi hoặc chưa có dữ liệu -> Về 0
                setLimit('0');
            } finally {
                setIsLoading(false);
            }
        };
        checkExistingBudget();
    }
  }, [isOpen, month, year]); // Chạy lại khi isOpen, month hoặc year thay đổi

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Cài Đặt Ngân Sách Tháng</h2>
        <form onSubmit={(e) => { 
            e.preventDefault(); 
            onSave(month, year, Math.floor(Number(limit))); 
            onClose(); 
        }}>
            <div className="flex gap-2 mb-3">
                <div className="w-1/2">
                    <label htmlFor="set-bg-month" className="block text-sm text-gray-600 mb-1">Tháng</label>
                    <select 
                        id="set-bg-month" 
                        className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-purple-500" 
                        value={month} 
                        onChange={e => setMonth(Number(e.target.value))} 
                        title="Chọn tháng"
                    >
                        {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>Tháng {m}</option>)}
                    </select>
                </div>
                <div className="w-1/2">
                    <label htmlFor="set-bg-year" className="block text-sm text-gray-600 mb-1">Năm</label>
                    <input 
                        id="set-bg-year" 
                        className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-purple-500" 
                        type="number" 
                        value={year} 
                        onChange={e => setYear(Number(e.target.value))} 
                        title="Nhập năm"
                    />
                </div>
            </div>
            
            <div className="mb-4">
                <label htmlFor="set-bg-limit" className="block text-sm font-bold text-gray-800 mb-1">Tổng tiền ngân sách</label>
                <div className="relative">
                    <input 
                        id="set-bg-limit" 
                        className={`w-full border p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 ${isLoading ? 'bg-gray-100' : ''}`}
                        type="number" 
                        placeholder="Ví dụ: 5000000" 
                        value={limit} 
                        onChange={e => setLimit(e.target.value)} 
                        required 
                        title="Nhập ngân sách" 
                        step="1"
                        disabled={isLoading} // Khóa ô nhập khi đang check dữ liệu
                    />
                    {isLoading && <span className="absolute right-2 top-2 text-xs text-gray-400">Đang kiểm tra...</span>}
                </div>
                
                {/* Dòng gợi ý: Bấm vào để copy số gợi ý lên ô nhập */}
                <p 
                    className="text-xs text-gray-500 mt-1 cursor-pointer hover:text-blue-600 hover:underline"
                    onClick={() => setLimit(String(Math.floor(suggestedBudget)))}
                    title="Bấm để dùng số này"
                >
                    * Gợi ý: {new Intl.NumberFormat('vi-VN').format(suggestedBudget)} ₫ (Tổng các danh mục)
                </p>
            </div>

            <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">Hủy</button>
                <button type="submit" className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">Lưu thiết lập</button>
            </div>
        </form>
      </div>
    </div>
  );
}