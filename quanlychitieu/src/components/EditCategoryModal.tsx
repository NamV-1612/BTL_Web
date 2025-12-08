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
      // SỬA: Dùng Math.floor để loại bỏ .00
      setLimit(String(Math.floor(category.limit))); 
    }
  }, [category, isOpen]);

  if (!isOpen || !category) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
        // SỬA: Đảm bảo gửi lên server là số nguyên
        onSave(category.id, name, Math.floor(Number(limit)));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-gray-800">
            {category.is_default === 1 ? "Sửa Hạn Mức" : "Sửa Danh Mục"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
             <label htmlFor="edit-cat-name" className="block text-sm font-medium text-gray-700 mb-1">
               Tên danh mục
             </label>
             <input 
                id="edit-cat-name"
                className={`w-full rounded border p-2 outline-none ${category.is_default === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500'}`}
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                disabled={category.is_default === 1} 
                title={category.is_default === 1 ? "Danh mục hệ thống không thể đổi tên" : "Nhập tên danh mục"} 
                placeholder="Tên danh mục..."
             />
             {category.is_default === 1 && <span className="text-xs text-orange-500 italic mt-1 block">* Bạn chỉ có thể sửa hạn mức cho danh mục này</span>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="edit-cat-limit" className="block text-sm font-medium text-gray-700 mb-1">
              Hạn mức chi tiêu
            </label>
            <input 
                id="edit-cat-limit"
                className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                type="number" 
                value={limit} 
                onChange={e => setLimit(e.target.value)} 
                placeholder="Nhập số tiền..."
                title="Nhập hạn mức chi tiêu"
                step="1" // Gợi ý trình duyệt chỉ nhập số nguyên
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">Hủy</button>
            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
  );
}