interface Props { 
  isOpen: boolean; 
  onClose: () => void; 
  expense: any; 
  onConfirm: (id: number) => void; 
}

export default function DeleteExpenseModal({ isOpen, onClose, expense, onConfirm }: Props) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-xl font-bold text-red-600">Xóa giao dịch?</h2>
        <p className="mb-6 text-gray-600">
            Bạn có chắc muốn xóa khoản {expense?.type === 'expense' ? 'chi' : 'thu'} này không?
            <br/>
            <b>{expense?.note || expense?.category}</b> - {Number(expense?.amount).toLocaleString()} đ
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">Hủy</button>
          <button onClick={() => onConfirm(expense.id)} className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">Xóa</button>
        </div>
      </div>
    </div>
  );
}