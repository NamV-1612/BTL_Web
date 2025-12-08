import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddExpenseModal from '../components/AddExpenseModal';
import EditExpenseModal from '../components/EditExpenseModal';
import DeleteExpenseModal from '../components/DeleteExpenseModal';
import { transactionService } from '../service/transactionService';
import { categoryService } from '../service/categoryService';

// --- ICONS SVG ---
const IconWallet = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>;
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconTrendingUp = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const IconTrendingDown = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
const IconLogout = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const IconArrowUp = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
const IconArrowDown = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;

interface Expense { id: number; type: 'expense' | 'income'; category: string; amount: number; date: string; note: string; }
interface Category { id: number; name: string; limit: number; }

export default function ExpensesPage() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [transRes, cateRes] = await Promise.all([transactionService.getAll(), categoryService.getAll()]);
      setExpenses(transRes.data || []);
      setCategories(cateRes.data || []);
    } catch (e) { 
        console.error(e); 
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };
  const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + ' ₫';
  const formatDate = (dateString: string) => { try { return new Date(dateString).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'}); } catch { return ''; } };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-800">
        {/* SIDEBAR */}
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
                <div onClick={() => navigate('/expenses')} className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20 cursor-pointer font-semibold transform scale-[1.02]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    Nhật ký chi tiêu
                </div>
                <div onClick={() => navigate('/categories')} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all cursor-pointer font-medium">
                    <IconWallet />
                    Danh mục & Hạn mức
                </div>
                <div onClick={() => navigate('/reports')} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all cursor-pointer font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
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
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-emerald-600 text-sm font-bold uppercase tracking-wider mb-1">Quản lý tài chính</h2>
                    <h1 className="text-3xl font-extrabold text-slate-800">Nhật Ký Giao Dịch</h1>
                </div>
                <button 
                    onClick={() => setIsAddOpen(true)} 
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
                >
                    <IconPlus />
                    Ghi giao dịch mới
                </button>
            </div>
            
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-medium animate-pulse">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden animate-fade-in-up">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="text-sm font-semibold text-gray-500">
                            Hiển thị {expenses.length} giao dịch
                        </div>
                    </div>

                    <div className="grid grid-cols-1">
                        {expenses.length > 0 ? expenses.map((e) => {
                            const isExpense = e.type === 'expense';
                            return (
                                <div key={e.id} className="p-5 border-b last:border-b-0 border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                    <div className="flex items-start gap-4 flex-1">
                                        {/* Icon Box */}
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-1 ${isExpense ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                            {isExpense ? <IconTrendingDown /> : <IconTrendingUp />}
                                        </div>
                                        
                                        {/* Info */}
                                        <div className="flex-col w-full">
                                            {/* Dòng 1: Danh mục & Ngày (Nhỏ hơn) */}
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded-md">
                                                    {e.category}
                                                </span>
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {formatDate(e.date)}
                                                </span>
                                            </div>
                                            
                                            {/* Dòng 2: Nội dung (To và Đậm) */}
                                            <p className="text-lg font-bold text-slate-800 leading-tight">
                                                {e.note || <span className="text-gray-400 italic font-normal text-base">Không có ghi chú</span>}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Amount & Actions */}
                                    <div className="flex flex-col items-end gap-2 ml-4">
                                        <div className={`text-right font-bold text-xl flex items-center gap-1 ${isExpense ? 'text-rose-600' : 'text-emerald-600'}`}>
                                            {isExpense ? '-' : '+'} {fmt(e.amount)}
                                            {isExpense ? <IconArrowDown /> : <IconArrowUp />}
                                        </div>
                                        
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => {setSelectedExpense(e); setIsEditOpen(true)}} 
                                                className="flex items-center gap-1 px-3 py-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                                            >
                                                <IconEdit /> Sửa
                                            </button>
                                            <button 
                                                onClick={() => {setSelectedExpense(e); setIsDeleteOpen(true)}} 
                                                className="flex items-center gap-1 px-3 py-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                                            >
                                                <IconTrash /> Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <p className="text-lg font-medium text-gray-500">Chưa có giao dịch nào</p>
                                <p className="text-sm">Hãy bắt đầu ghi chép chi tiêu của bạn ngay hôm nay.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
        
        {/* Modals */}
        <AddExpenseModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={async (type, cat, amt, date, note) => { await transactionService.create({type, category: cat, amount: amt, date, note}); fetchData(); setIsAddOpen(false); }} categories={categories} expenses={expenses} />
        <EditExpenseModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} expense={selectedExpense} onSave={async (id, cat, amt, date, note) => { await transactionService.update(id, {category: cat, amount: amt, date, note}); fetchData(); setIsEditOpen(false); }} categories={categories} />
        <DeleteExpenseModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} expense={selectedExpense} onConfirm={async (id) => { await transactionService.delete(id); fetchData(); setIsDeleteOpen(false); }} />
    </div>
  );
}