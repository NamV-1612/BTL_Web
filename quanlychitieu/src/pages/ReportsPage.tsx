import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../service/transactionService'; 
import { reportService } from '../service/reportService';

// --- ICONS SVG ---
const IconChartPie = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>;
const IconChartBar = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const IconLightBulb = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const IconWallet = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>;
const IconLogout = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

export default function ReportsPage() {
  const navigate = useNavigate();
  
  // State dữ liệu
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [incomeData, setIncomeData] = useState<any[]>([]);
  const [annualData, setAnnualData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State điều khiển Tab
  const [chartType, setChartType] = useState<'expense' | 'income'>('expense');

  // Màu sắc hiện đại (Pastel & Vivid mix)
  const COLORS_EXPENSE = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6'];
  const COLORS_INCOME = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#059669', '#047857'];

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  useEffect(() => {
    const fetchData = async () => {
        try {
            setIsLoading(true);
            
            // 1. Lấy dữ liệu Biểu đồ tròn
            const transRes = await transactionService.getAll();
            const allTrans = transRes.data || [];

            const thisMonthTrans = allTrans.filter((t: any) => {
                if (!t.date) return false;
                const d = new Date(t.date);
                return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
            });

            const groupData = (type: string, colors: string[]) => {
                const grouped = thisMonthTrans
                    .filter((t: any) => t.type === type)
                    .reduce((acc: any, curr: any) => {
                        const cat = curr.category || 'Khác';
                        acc[cat] = (acc[cat] || 0) + Number(curr.amount);
                        return acc;
                    }, {});

                return Object.keys(grouped)
                    .map((key, index) => ({
                        name: key,
                        value: grouped[key],
                        color: colors[index % colors.length]
                    }))
                    .sort((a, b) => b.value - a.value); 
            };

            setExpenseData(groupData('expense', COLORS_EXPENSE));
            setIncomeData(groupData('income', COLORS_INCOME));

            // 2. Lấy dữ liệu Biểu đồ cột
            const resAnn = await reportService.getAnnual(today.getFullYear());
            const processedAnnualData = (resAnn.data || []).map((item: any) => ({
                ...item,
                spent: Number(item.spent),
                limit: Number(item.limit) || 0 
            }));

            setAnnualData(processedAnnualData);

        } catch (e) { 
            console.error(e); 
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, []);

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };
  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + ' ₫';

  const currentPieData = chartType === 'expense' ? expenseData : incomeData;
  const totalValue = useMemo(() => currentPieData.reduce((sum, item) => sum + item.value, 0), [currentPieData]);

  const getBarColor = (spent: number, limit: number) => {
      if (limit === 0) return '#94a3b8'; // Slate-400
      const percent = (spent / limit) * 100;
      if (percent >= 100) return '#ef4444'; // Red-500
      if (percent >= 75) return '#f97316';  // Orange-500
      return '#10b981'; // Emerald-500
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-800">
        {/* SIDEBAR (Đồng bộ) */}
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 shadow-2xl relative z-10 transition-all duration-300">
            <div className="p-8">
                <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-lg">E</div>
                    <span>Econo<span className="text-emerald-400">Me</span></span>
                </h1>
            </div>
            
            <nav className="flex-1 px-4 space-y-3">
                <div onClick={() => navigate('/')} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all cursor-pointer font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                    Tổng quan
                </div>
                <div onClick={() => navigate('/expenses')} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all cursor-pointer font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    Nhật ký chi tiêu
                </div>
                <div onClick={() => navigate('/categories')} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all cursor-pointer font-medium">
                    <IconWallet />
                    Danh mục & Hạn mức
                </div>
                <div onClick={() => navigate('/reports')} className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20 cursor-pointer font-semibold transform scale-[1.02]">
                    <IconChartPie />
                    Báo cáo
                </div>
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
            <div className="mb-8">
                <h2 className="text-emerald-600 text-sm font-bold uppercase tracking-wider mb-1">Phân tích tài chính</h2>
                <h1 className="text-3xl font-extrabold text-slate-800">Báo Cáo & Thống Kê</h1>
            </div>
            
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-medium animate-pulse">Đang tổng hợp dữ liệu...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
                    
                    {/* --- BIỂU ĐỒ TRÒN (Cơ cấu chi tiêu) --- */}
                    <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-[600px] relative">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <IconChartPie />
                                </div>
                                <h2 className="font-bold text-lg text-slate-800">Cơ cấu Tháng {currentMonth}</h2>
                            </div>
                            
                            {/* Tab Switcher */}
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                <button 
                                    onClick={() => setChartType('expense')} 
                                    className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${chartType === 'expense' ? 'bg-white text-red-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Chi tiêu
                                </button>
                                <button 
                                    onClick={() => setChartType('income')} 
                                    className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${chartType === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Thu nhập
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 w-full min-h-0 relative">
                            {currentPieData.length > 0 ? (
                                <>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie 
                                                data={currentPieData} 
                                                dataKey="value" 
                                                nameKey="name" 
                                                cx="50%" 
                                                cy="45%" 
                                                innerRadius={60} // Donut chart cho hiện đại
                                                outerRadius={120} 
                                                paddingAngle={2}
                                                cornerRadius={4}
                                            >
                                                {currentPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                                            </Pie>
                                            <Tooltip 
                                                formatter={(value: number) => {
                                                    const percent = totalValue > 0 ? (value / totalValue * 100).toFixed(1) : 0;
                                                    return [`${fmt(value)} (${percent}%)`, 'Số tiền'];
                                                }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                            />
                                            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} iconType="circle"/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    
                                    {/* Tổng tiền ở giữa biểu đồ Donut */}
                                    <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                        <p className="text-xs text-slate-400 font-medium uppercase">Tổng</p>
                                        <p className="text-lg font-extrabold text-slate-800">{fmt(totalValue)}</p>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <p className="font-medium">Chưa có dữ liệu</p>
                                </div>
                            )}
                        </div>

                        {/* Top Chi Tiêu List */}
                        {chartType === 'expense' && expenseData.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wide">Top chi tiêu nhiều nhất</p>
                                <div className="space-y-3 overflow-y-auto max-h-[150px] pr-2 custom-scrollbar">
                                    {expenseData.map((item, index) => {
                                        const percent = totalValue > 0 ? (item.value / totalValue * 100) : 0;
                                        return (
                                            <div key={index} className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-8 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-slate-700">{item.name}</p>
                                                        <p className="text-[10px] text-slate-400">{percent.toFixed(1)}%</p>
                                                    </div>
                                                </div>
                                                <p className="font-bold text-sm text-slate-800 group-hover:text-emerald-600 transition-colors">{fmt(item.value)}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- BIỂU ĐỒ CỘT (Xu hướng năm) --- */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 h-[400px] flex flex-col">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                                    <IconChartBar />
                                </div>
                                <h2 className="font-bold text-lg text-slate-800">Xu hướng năm {new Date().getFullYear()}</h2>
                            </div>
                            
                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={annualData} margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `${val/1000}k`} />
                                        <Tooltip 
                                            formatter={(v: number) => fmt(v)} 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                            cursor={{ fill: '#f8fafc' }}
                                        />
                                        <Legend verticalAlign="top" align="right" height={36} iconType="circle"/>
                                        <Bar dataKey="spent" name="Thực chi" barSize={12} radius={[4, 4, 0, 0]}>
                                            {annualData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={getBarColor(entry.spent, entry.limit)} />
                                            ))}
                                        </Bar>
                                        <Line type="monotone" dataKey="limit" name="Hạn mức" stroke="#fb923c" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6 }} strokeDasharray="5 5" />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* --- GÓC LỜI KHUYÊN (INSIGHTS) --- */}
                        {chartType === 'expense' && expenseData.length > 0 && (
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <IconLightBulb />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Góc nhìn tài chính</h3>
                                        <p className="text-indigo-100 text-sm leading-relaxed">
                                            Tháng này bạn chi tiêu nhiều nhất vào <b>{expenseData[0]?.name}</b> ({fmt(expenseData[0]?.value)}). 
                                            {expenseData[0]?.value > (totalValue * 0.4) 
                                                ? " Khoản này chiếm hơn 40% tổng chi tiêu, hãy cân nhắc xem có thể tối ưu không nhé!" 
                                                : " Mức chi tiêu này vẫn trong tầm kiểm soát tốt."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    </div>
  );
}