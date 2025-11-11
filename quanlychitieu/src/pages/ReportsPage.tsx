export default function ReportsPage() {
  return (
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
            className="block rounded px-4 py-2 hover:bg-gray-700"
          >
            Danh mục
          </a>
          <a
            href="/reports"
            className="block rounded bg-gray-900 px-4 py-2 font-bold"
          >
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
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Báo Cáo & Thống Kê</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Chi tiêu theo Danh mục (Tháng này)
            </h2>
            <div className="flex h-64 items-center justify-center rounded bg-gray-100 text-gray-500">
              (Đây là nơi cho Biểu đồ tròn - Pie Chart)
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Tổng quan chi tiêu (6 tháng gần nhất)
            </h2>
            <div className="flex h-64 items-center justify-center rounded bg-gray-100 text-gray-500">
              (Đây là nơi cho Biểu đồ cột - Bar Chart)
            </div>
          </div>
        </div>
        
        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            Thống kê chi tiêu theo năm
          </h2>
          <div className="flex h-48 items-center justify-center rounded bg-gray-100 text-gray-500">
            (Đây là nơi cho Bảng thống kê chi tiêu, định mức, vượt mức)
          </div>
        </div>
      </main>
    </div>
  );
}