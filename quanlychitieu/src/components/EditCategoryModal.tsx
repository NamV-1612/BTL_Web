import { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
  limit: number;
  is_default: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (id: number, name: string, limit: number) => void;
}

export default function EditCategoryModal({ isOpen, onClose, category, onSave }: Props) {
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setLimit(String(Math.floor(category.limit))); 
    }
  }, [category, isOpen]);

  if (!isOpen || !category) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
        onSave(category.id, name, Math.floor(Number(limit)));
        onClose();
    }
  };

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
            <span className="text-emerald-600 text-xl">📝</span>
            <h2 className="text-2xl font-bold text-gray-900">
              {category.is_default === 1 ? "Sửa Hạn Mức" : "Sửa Danh Mục"}
            </h2>
          </div>
          <p className="text-sm text-gray-500">Cập nhật thông tin để quản lý chi tiêu chính xác hơn.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input: Tên danh mục */}
          <div>
            <label htmlFor="edit-cat-name" className="mb-1.5 block text-sm font-semibold text-gray-700">
              Tên danh mục
            </label>
            <input 
              id="edit-cat-name"
              className={`w-full rounded-xl border px-4 py-3 outline-none transition-all ${
                category.is_default === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                : 'bg-gray-50 border-gray-200 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100'
              }`}
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              disabled={category.is_default === 1} 
              placeholder="Tên danh mục..."
            />
            {category.is_default === 1 && (
              <p className="mt-2 text-xs text-amber-600 italic flex items-center gap-1">
                <span>⚠️</span> Danh mục mặc định không thể đổi tên
              </p>
            )}
          </div>
          
          {/* Input: Hạn mức */}
          <div>
            <label htmlFor="edit-cat-limit" className="mb-1.5 block text-sm font-semibold text-gray-700">
              Hạn mức chi tiêu <span className="text-xs font-normal text-emerald-600/70">(VNĐ)</span>
            </label>
            <input 
              id="edit-cat-limit"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" 
              type="number" 
              value={limit} 
              onChange={e => setLimit(e.target.value)} 
              placeholder="Nhập số tiền..."
              step="1"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3">
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
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}