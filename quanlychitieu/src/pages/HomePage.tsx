    import { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { transactionService } from '../service/transactionService';
    import { categoryService } from '../service/categoryService';

    // --- BỘ ICON SVG (Để không phải cài thêm thư viện) ---
    const IconWallet = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
    );
    const IconTrendingUp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
    );
    const IconTrendingDown = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
    );
    const IconTarget = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    );
    const IconLogout = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
    );

    export default function HomePage() {
    const navigate = useNavigate();
    
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [totalLimit, setTotalLimit] = useState(0);
    
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    useEffect(() => {
        const fetchData = async () => {
        try {
            setIsLoading(true);
            const [transRes, cateRes] = await Promise.all([
            transactionService.getAll(),
            categoryService.getAll()
            ]);

            const allTrans = transRes?.data || [];
            const categories = cateRes?.data || [];
            
            const calculatedLimit = categories.reduce((sum: number, cat: any) => sum + Number(cat.limit), 0);
            setTotalLimit(calculatedLimit);

            const thisMonthTrans = allTrans.filter((t: any) => {
                if (!t.date) return false;
                const d = new Date(t.date);
                return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
            });

            const income = thisMonthTrans
                .filter((t: any) => t.type === 'income')
                .reduce((s: number, t: any) => s + Number(t.amount || 0), 0);
                
            const spent = thisMonthTrans
                .filter((t: any) => t.type === 'expense')
                .reduce((s: number, t: any) => s + Number(t.amount || 0), 0);

            setTotalIncome(income);
            setTotalSpent(spent);
            
            // Sắp xếp giao dịch mới nhất lên đầu
            const sortedTrans = [...allTrans].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setRecentTransactions(sortedTrans.slice(0, 5));

        } catch (error) {
            console.error("Lỗi tải trang chủ:", error);
        } finally {
            setIsLoading(false);
        }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user'); 
        navigate('/login'); 
    };

    const remaining = totalIncome - totalSpent; 
    
    const percent = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
    const isOverLimit = totalSpent > totalLimit;

    // Logic màu sắc gradient cho thanh tiến trình
    let progressClass = 'from-emerald-400 to-emerald-600'; 
    if (percent >= 100) {
        progressClass = 'from-red-500 to-red-700'; 
    } else if (percent >= 75) {
        progressClass = 'from-orange-400 to-orange-600';
    } else if (percent >= 60) {
        progressClass = 'from-yellow-300 to-yellow-500';
    }

    const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + ' ₫';
    
    const formatDate = (dateString: string) => {
        if (!dateString) return '---';
        try { 
            return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }); 
        } catch { return 'Err'; }
    }

    return (
        <div className="flex h-screen bg-gray-50 w-full font-sans text-gray-800">
        
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 transition-all duration-300 shadow-2xl relative z-10">
            <div className="p-8">
                <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-lg">E</div>
                    <span>Econo<span className="text-emerald-400">Me</span></span>
                </h1>
            </div>
            
            <nav className="flex-1 px-4 space-y-3">
                <a href="/" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20 font-semibold transition-transform transform hover:scale-[1.02]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                    Tổng quan
                </a>
                <a href="/expenses" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    Nhật ký chi tiêu
                </a>
                <a href="/categories" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                    Danh mục & Hạn mức
                </a>
                <a href="/reports" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                    Báo cáo
                </a>
            </nav>
            
            <div className="p-6 border-t border-slate-800">
                <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white transition-all duration-300 font-semibold text-sm group">
                    <IconLogout />
                    <span className="group-hover:translate-x-1 transition-transform">Đăng xuất</span>
                </button>
            </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto">
            {/* Header Section */}
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-emerald-600 text-sm font-bold uppercase tracking-wider mb-1">Bảng điều khiển tài chính</h2>
                    <h1 className="text-4xl font-extrabold text-slate-800">Tháng {currentMonth}, {currentYear}</h1>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-600">Hôm nay: {today.toLocaleDateString('vi-VN')}</span>
                </div>
            </header>
            
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-medium animate-pulse">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div className="space-y-8 animate-fade-in">
                    
                    {/* 1. THẺ THỐNG KÊ (CARDS) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Card: Thu nhập */}
                        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                                    <IconTrendingUp />
                                </div>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+ Thu</span>
                            </div>
                            <p className="text-gray-500 font-medium text-sm mb-1">Tổng Thu Nhập</p>
                            <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{fmt(totalIncome)}</p>
                        </div>

                        {/* Card: Chi tiêu */}
                        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
                                    <IconTrendingDown />
                                </div>
                                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">- Chi</span>
                            </div>
                            <p className="text-gray-500 font-medium text-sm mb-1">Tổng Chi Tiêu</p>
                            <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{fmt(totalSpent)}</p>
                        </div>

                        {/* Card: Số dư */}
                        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
                            <div className={`absolute right-0 top-0 w-32 h-32 rounded-bl-full -mr-8 -mt-8 transition-opacity opacity-20 group-hover:opacity-30 ${remaining < 0 ? 'bg-rose-400' : 'bg-blue-400'}`}></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${remaining < 0 ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                                        <IconWallet />
                                    </div>
                                </div>
                                <p className="text-gray-500 font-medium text-sm mb-1">Số dư hiện tại</p>
                                <p className={`text-3xl font-extrabold tracking-tight ${remaining < 0 ? 'text-rose-600' : 'text-blue-600'}`}>{fmt(remaining)}</p>
                            </div>
                        </div>

                        {/* Card: Định mức */}
                        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                                    <IconTarget />
                                </div>
                                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">Limit</span>
                            </div>
                            <p className="text-gray-500 font-medium text-sm mb-1">Tổng Hạn Mức</p>
                            <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{fmt(totalLimit)}</p>
                        </div>
                    </div>

                    {/* 2. THANH TIẾN TRÌNH */}
                    <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
                        <div className="flex justify-between items-end mb-5">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 mb-1">Tiến độ chi tiêu</h2>
                                <p className="text-sm text-gray-500">Dựa trên tổng hạn mức các danh mục</p>
                            </div>
                            <div className={`text-sm font-bold px-4 py-1.5 rounded-full border ${isOverLimit ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                Đã dùng {Math.round(percent)}%
                            </div>
                        </div>
                        
                        <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                            <div 
                                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${progressClass}`} 
                                style={{ width: `${Math.min(percent, 100)}%` }}
                            >
                                {/* Hiệu ứng bóng lóa nhẹ */}
                                <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-l from-white/20 to-transparent"></div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-4 text-sm font-medium">
                            <span className="text-gray-600">Thực chi: <span className="text-slate-900 font-bold">{fmt(totalSpent)}</span></span>
                            <span>
                                {isOverLimit 
                                    ? <span className="text-rose-600 font-bold flex items-center gap-1">⚠️ Vượt quá {fmt(totalSpent - totalLimit)}</span> 
                                    : <span className="text-emerald-600 font-bold">Còn lại {fmt(totalLimit - totalSpent)}</span>
                                }
                            </span>
                        </div>
                    </div>

                    {/* 3. BẢNG GIAO DỊCH */}
                    <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                            <h2 className="text-xl font-bold text-slate-800">Giao dịch gần đây</h2>
                            <a href="/expenses" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors">
                                Xem tất cả &rarr;
                            </a>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/80">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Danh mục</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ghi chú</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày</th>
                                        <th className="px-8 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Số tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentTransactions.map((t, index) => {
                                        const isExpense = t.type === 'expense';
                                        return (
                                            <tr key={t.id || index} className="hover:bg-gray-50 transition-colors group">
                                                <td className="px-8 py-5 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <span className={`w-2.5 h-2.5 rounded-full mr-3 ring-4 ring-opacity-20 ${isExpense ? 'bg-rose-500 ring-rose-200' : 'bg-emerald-500 ring-emerald-200'}`}></span>
                                                        <span className="font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors">{t.category}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-gray-600 text-sm">
                                                    {t.note ? (
                                                        <span className="truncate max-w-xs block">{t.note}</span>
                                                    ) : <span className="text-gray-300 italic text-xs">--</span>}
                                                </td>
                                                <td className="px-8 py-5 text-gray-500 text-sm font-medium">
                                                    {formatDate(t.date)}
                                                </td>
                                                <td className={`px-8 py-5 whitespace-nowrap text-right font-bold text-base ${isExpense ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                    {isExpense ? '-' : '+'} {fmt(t.amount)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {recentTransactions.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-16 text-center text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <svg className="w-12 h-12 text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                                    <span>Chưa có giao dịch nào trong tháng này.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </main>
        </div>
    );
    }