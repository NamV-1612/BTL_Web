interface Props { 
  isOpen: boolean; 
  onClose: () => void; 
  expense: any; 
  onConfirm: (id: number) => void; 
}

export default function DeleteExpenseModal({ isOpen, onClose, expense, onConfirm }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay mờ đồng bộ */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all border border-rose-50">
        
        {/* Warning Icon & Title */}
        <div className="mb-4 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <span className="text-2xl">💸</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Xóa giao dịch?</h2>
        </div>

        {/* Content Section */}
        <div className="mb-8 text-center px-2">
          <p className="text-gray-600">
            Bạn có chắc muốn xóa khoản {expense?.type === 'expense' ? 'chi' : 'thu'} này?
          </p>
          
          <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              {expense?.note || expense?.category}
            </div>
            <div className={`mt-1 text-lg font-bold ${expense?.type === 'expense' ? 'text-rose-600' : 'text-emerald-600'}`}>
              {expense?.type === 'expense' ? '-' : '+'} {Number(expense?.amount).toLocaleString()} đ
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex gap-3 mt-6">
          <button 
            onClick={onClose} 
            className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-semibold text-gray-600 transition-all hover:bg-gray-200"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={() => onConfirm(expense.id)} 
            className="flex-1 rounded-xl bg-rose-600 px-4 py-3 font-semibold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-700 active:scale-[0.98]"
          >
            Xóa ngay
          </button>
        </div>
      </div>
    </div>
  );
}