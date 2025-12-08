interface Props { 
  isOpen: boolean; 
  onClose: () => void; 
  category: any; 
  onConfirm: (id: number) => void; 
}

export default function DeleteCategoryModal({ isOpen, onClose, category, onConfirm }: Props) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-xl font-bold text-red-600">Xác nhận xóa?</h2>
        <p className="mb-6 text-gray-600">
            Bạn có chắc muốn xóa danh mục <b>{category?.name}</b> không? 
            <br/><br/>
            <span className="text-sm italic">Lưu ý: Các giao dịch thuộc danh mục này sẽ được chuyển sang nhóm "Khác" (Other).</span>
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">Hủy</button>
          <button onClick={() => onConfirm(category.id)} className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">Xóa luôn</button>
        </div>
      </div>
    </div>
  );
}