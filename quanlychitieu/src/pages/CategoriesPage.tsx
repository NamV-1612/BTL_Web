import { useState } from 'react';
import AddCategoryModal from '../components/AddCategoryModal';

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dummyCategories = [
    { id: 1, name: 'Ăn uống' },
    { id: 2, name: 'Mua sắm' },
    { id: 3, name: 'Giải trí' },
    { id: 4, name: 'Di chuyển' },
    { id: 5, name: 'Hóa đơn' },
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
              className="block rounded px-4 py-2 hover:bg-gray-700"
            >
              Quản lý chi tiêu
            </a>
            <a
              href="/categories"
              className="block rounded bg-gray-900 px-4 py-2 font-bold"
            >
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
              Quản Lý Danh Mục
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              + Thêm danh mục
            </button>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tên danh mục
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {dummyCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {category.name}
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

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}