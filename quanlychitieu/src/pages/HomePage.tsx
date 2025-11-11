export default function HomePage() {
  return (
    <div className="flex h-screen w-full bg-gray-100">
      <aside className="flex w-64 flex-col bg-gray-800 text-white">
        <div className="flex h-16 items-center justify-center p-4">
          <span className="text-2xl font-bold">Quản Lý Chi Tiêu</span>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <a
            href="/"
            className="block rounded bg-gray-900 px-4 py-2 font-bold"
          >
            Tổng quan
          </a>
          <a
            href="/expenses"
            className="block rounded px-4 py-2 hover:bg-gray-700"
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
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          Chào mừng trở lại!
        </h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-2 text-sm font-semibold text-gray-500">
              CHI TIÊU THÁNG NÀY
            </h2>
            <p className="text-3xl font-bold text-red-500">5.200.000 ₫</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-2 text-sm font-semibold text-gray-500">
              ĐỊNH MỨC CÒN LẠI
            </h2>
            <p className="text-3xl font-bold text-green-500">2.800.000 ₫</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-2 text-sm font-semibold text-gray-500">
              CHI TIÊU NHIỀU NHẤT
            </h2>
            <p className="text-3xl font-bold text-gray-800">Ăn uống</p>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            Các khoản chi tiêu gần đây
          </h2>
          <p className="text-gray-600">
            (Đây là nơi chúng ta sẽ hiển thị danh sách các khoản chi tiêu... )
          </p>
        </div>
      </main>
    </div>
  );
}