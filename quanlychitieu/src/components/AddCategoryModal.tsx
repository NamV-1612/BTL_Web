import { useState } from 'react';

interface Props { 
  isOpen: boolean; 
  onClose: () => void; 
  onAdd: (name: string, limit: number) => void; 
}

export default function AddCategoryModal({ isOpen, onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(name, Math.floor(Number(limit)) || 0);
    setName(''); 
    setLimit('');
    onClose(); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all">
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">✨ Thêm Danh Mục</h2>
          <p className="text-sm text-gray-500">Phân loại chi tiêu giúp bạn kiểm soát tài chính tốt hơn.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tên danh mục */}
          <div>
            <label htmlFor="add-cat-name" className="mb-1.5 block text-sm font-semibold text-gray-700">
              Tên danh mục
            </label>
            <input 
              id="add-cat-name"
              autoFocus
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" 
              placeholder="Ví dụ: Ăn uống, Du lịch..." 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          </div>

          {/* nhập hạn mức */}
          <div>
            <label htmlFor="add-cat-limit" className="mb-1.5 block text-sm font-semibold text-gray-700">
              Hạn mức chi tiêu <span className="text-xs font-normal text-emerald-600/70">(VND)</span>
            </label>
            <div className="relative">
              <input 
                id="add-cat-limit"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" 
                type="number" 
                placeholder="Nhập số tiền..." 
                value={limit} 
                onChange={e => setLimit(e.target.value)} 
                step="1"
              />
              {Number(limit) === 0 && limit !== '' && (
                <p className="mt-2 text-xs text-emerald-700 font-medium">💡 Hạn mức 0 = Không giới hạn chi tiêu</p>
              )}
            </div>
          </div>

          {/* nut chuc nang */}
          <div className="mt-8 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-semibold text-gray-600 transition-colors hover:bg-gray-200"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              className="flex-[2] rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 active:scale-[0.98]"
            >
              Lưu danh mục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}