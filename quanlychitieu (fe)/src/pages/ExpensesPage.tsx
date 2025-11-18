import { useState } from 'react';
import AddExpenseModal from '../components/AddExpenseModal';

export default function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dummyExpenses = [
    {
      id: 1,
      category: 'Ăn uống',
      amount: 50000,
      date: '2025-11-10',
      note: 'Cà phê sáng',
    },
    {
      id: 2,
      category: 'Mua sắm',
      amount: 1200000,
      date: '2025-11-09',
      note: 'Áo khoác mới',
    },
    {
      id: 3,
      category: 'Giải trí',
      amount: 350000,
      date: '2025-11-09',
      note: 'Xem phim',
    },
  ];

  return (
    <>
      <div className="flex h-screen w-full bg-gray-100">
        <aside className="flex w-64 flex-col bg-gray-800 text-white">
          <div className="flex h-16 items-center justify-center p-4">
            <span className="text-2xl font-bold">Quản Lý Chi Tiêu</span>
          </div>
          <nav className="flex-1 space-y-2 p-4">
            <a href="/" className="block rounded px-4 py-2 hover:bg-gray-700">
              Tổng quan
            </a>
            <a
              href="/expenses"
              className="block rounded bg-gray-900 px-4 py-2 font-bold"
            >
              Quản lý chi tiêu
            </a>
            <a href="/categories" className="block rounded px-4 py-2 hover:bg-gray-700">
              Danh mục
            </a>
            <a href="/reports" className="block rounded px-4 py-2 hover:bg-gray-700">
              Báo cáo
            </a>
          </nav>
          <div className="p-4">
            <button className="w-full rounded bg-red-500 px-4 py-2 hover:bg-red-600">
              Đăng xuất
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">
              Quản Lý Chi Tiêu
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              + Thêm chi tiêu
            </button>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Loại khoản chi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ghi chú
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {dummyExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {expense.category}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {expense.amount.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {expense.date}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {expense.note}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button className="mr-2 text-indigo-600 hover:text-indigo-900">
                        Sửa
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}