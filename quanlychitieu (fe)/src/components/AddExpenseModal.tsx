interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddExpenseModal({
  isOpen,
  onClose,
}: AddExpenseModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Thêm khoản chi tiêu mới</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <form>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="category"
            >
              Loại khoản chi
            </label>
            <select
              className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="category"
            >
              <option>Ăn uống</option>
              <option>Mua sắm</option>
              <option>Giải trí</option>
              <option>Di chuyển</option>
              <option>Khác</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="amount"
            >
              Số tiền
            </label>
            <input
              className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="amount"
              type="number"
              placeholder="0"
            />
          </div>

          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="date"
            >
              Thời gian
            </label>
            <input
              className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="date"
              type="date"
            />
          </div>

          <div className="mb-6">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="note"
            >
              Ghi chú
            </label>
            <textarea
              className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="note"
              placeholder="Ghi chú thêm (ví dụ: ăn tối với bạn...)"
              rows={3}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-200 px-4 py-2 font-bold text-gray-800 hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}