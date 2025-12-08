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
    // SỬA: Math.floor khi lưu
    onAdd(name, Math.floor(Number(limit)) || 0);
    setName(''); 
    setLimit('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Thêm Danh Mục Mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="add-cat-name" className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</label>
            <input 
              id="add-cat-name"
              className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Ví dụ: Du lịch..." 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              title="Nhập tên danh mục"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="add-cat-limit" className="block text-sm font-medium text-gray-700 mb-1">Hạn mức chi tiêu (0 = Không giới hạn)</label>
            <input 
              id="add-cat-limit"
              className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
              type="number" 
              placeholder="Nhập số tiền..." 
              value={limit} 
              onChange={e => setLimit(e.target.value)} 
              title="Nhập hạn mức"
              step="1"
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