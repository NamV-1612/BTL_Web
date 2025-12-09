interface Props { 
  isOpen: boolean; 
  onClose: () => void; 
  category: any; 
  onConfirm: (id: number) => void; 
}

export default function DeleteCategoryModal({ isOpen, onClose, category, onConfirm }: Props) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay: Backdrop blur đồng bộ */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all border border-rose-50">
        
        {/* Warning Icon & Title */}
        <div className="mb-4 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <span className="text-2xl">🗑️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Xác nhận xóa?</h2>
        </div>

        {/* Content */}
        <div className="mb-8 text-center">
          <p className="text-gray-600">
            Bạn có chắc muốn xóa danh mục <span className="font-bold text-gray-900">"{category?.name}"</span>?
          </p>
          <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800 border border-amber-100">
            <strong>Lưu ý:</strong> Các giao dịch cũ sẽ tự động được chuyển sang nhóm <span className="italic italic font-semibold">"Khác"</span>.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-semibold text-gray-600 transition-all hover:bg-gray-200"
          >
            Hủy
          </button>
          <button 
            onClick={() => onConfirm(category.id)} 
            className="flex-1 rounded-xl bg-rose-600 px-4 py-3 font-semibold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-700 active:scale-[0.98]"
          >
            Xóa ngay
          </button>
        </div>
      </div>
    </div>
  );
}