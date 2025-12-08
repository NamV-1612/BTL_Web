import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCategoryModal from '../components/AddCategoryModal';
import EditCategoryModal from '../components/EditCategoryModal';
import DeleteCategoryModal from '../components/DeleteCategoryModal';
import SetBudgetModal from '../components/SetBudgetModal';
import { categoryService } from '../service/categoryService';
import { budgetService } from '../service/budgetService';
import { transactionService } from '../service/transactionService';

// --- ICONS SVG ---
const IconWallet = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-12H4" /></svg>;
const IconLogout = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

interface Category { 
    id: number; 
    name: string; 
    limit: number; 
    is_default: number;
    spent: number; 
}

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const fetchData = async () => {
    try { 
        setIsLoading(true);
        const [cateRes, transRes] = await Promise.all([
            categoryService.getAll(),
            transactionService.getAll()
        ]); 

        const allTrans = transRes.data || [];
        const rawCategories = cateRes.data || [];

        const thisMonthExpenses = allTrans.filter((t: any) => {
            if (!t.date || t.type !== 'expense') return false;
            const d = new Date(t.date);
            return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
        });

        const categoriesWithSpent = rawCategories.map((cat: any) => {
            const spentAmount = thisMonthExpenses
                .filter((t: any) => t.category === cat.name)
                .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

            return {
                ...cat,
                limit: Number(cat.limit),
                spent: spentAmount
            };
        });

        setCategories(categoriesWithSpent); 
    } catch (e) { 
        console.error(e); 
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };
  
  const fmt = (n: number) => {
      return new Intl.NumberFormat('vi-VN').format(n) + ' ₫';
  };

  const totalSuggestedBudget = useMemo(() => {
      return categories.reduce((sum, cat) => sum + (cat.limit || 0), 0);
  }, [categories]);

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-800">
        {/* SIDEBAR (Đồng bộ với HomePage) */}
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
                <div onClick={() => navigate('/categories')} className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20 cursor-pointer font-semibold transform scale-[1.02]">
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
                    <h2 className="text-emerald-600 text-sm font-bold uppercase tracking-wider mb-1">Quản lý chi tiêu</h2>
                    <h1 className="text-3xl font-extrabold text-slate-800">Danh Mục & Hạn Mức (T{currentMonth})</h1>
                </div>
                <button 
                    onClick={() => setIsBudgetOpen(true)} 
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-slate-300/50 transition-all transform hover:-translate-y-0.5"
                >
                    <IconSettings />
                    Cài ngân sách tổng
                </button>
            </div>
            
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-medium animate-pulse">Đang tải danh mục...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                    {categories.map((cat) => {
                        const hasLimit = cat.limit > 0;
                        const percent = hasLimit ? (cat.spent / cat.limit) * 100 : 0;
                        const isOver = cat.spent > cat.limit && hasLimit;
                        
                        // Logic màu sắc thông minh
                        let barGradient = 'from-emerald-400 to-emerald-600';
                        let statusColor = 'text-emerald-600';
                        let statusText = 'An toàn';
                        
                        if (percent >= 100 || isOver) {
                            barGradient = 'from-red-500 to-red-700';
                            statusColor = 'text-red-600';
                            statusText = 'Vượt mức';
                        } else if (percent >= 80) {
                            barGradient = 'from-orange-400 to-orange-600';
                            statusColor = 'text-orange-500';
                            statusText = 'Cảnh báo';
                        } else if (percent >= 60) {
                            barGradient = 'from-yellow-300 to-yellow-500';
                            statusColor = 'text-yellow-600';
                            statusText = 'Khá cao';
                        }

                        return (
                            <div key={cat.id} className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 relative hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm bg-gradient-to-br ${isOver ? 'from-red-400 to-red-600' : 'from-slate-700 to-slate-900'}`}>
                                            {cat.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800">{cat.name}</h3>
                                            {cat.is_default === 1 && (
                                                <span className="inline-block text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-slate-200">
                                                    Mặc định
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {hasLimit && (
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md bg-opacity-10 ${statusColor.replace('text-', 'bg-')} ${statusColor}`}>
                                            {statusText}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="space-y-1 mb-4">
                                    <div className="flex justify-between items-end">
                                        <p className="text-sm text-gray-500 font-medium">Đã chi</p>
                                        <p className={`text-2xl font-extrabold tracking-tight ${isOver ? 'text-red-600' : 'text-slate-800'}`}>
                                            {fmt(cat.spent).replace(' ₫', '')}<span className="text-sm font-normal text-gray-400 ml-1">₫</span>
                                        </p>
                                    </div>
                                    
                                    {hasLimit ? (
                                        <div className="relative pt-2">
                                            <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1.5">
                                                <span>0%</span>
                                                <span>{Math.round(percent)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${barGradient}`} 
                                                    style={{ width: `${Math.min(percent, 100)}%` }}
                                                >
                                                    {/* Hiệu ứng bóng */}
                                                    <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-l from-white/20 to-transparent"></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <p className="text-xs text-gray-500">Hạn mức: <span className="font-bold text-slate-700">{fmt(cat.limit)}</span></p>
                                                <p className="text-xs font-bold text-emerald-600">
                                                    {isOver ? '' : `Còn: ${fmt(cat.limit - cat.spent)}`}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-3 px-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                                            <p className="text-sm text-slate-400 italic">Không giới hạn ngân sách</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-gray-50 flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => {setSelectedCategory(cat); setIsEditOpen(true)}} 
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all"
                                    >
                                        <IconEdit /> Sửa
                                    </button>

                                    {cat.is_default !== 1 && (
                                        <button 
                                            onClick={() => {setSelectedCategory(cat); setIsDeleteOpen(true)}} 
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
                                        >
                                            <IconTrash /> Xóa
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Add New Card */}
                    <button 
                        onClick={() => setIsAddOpen(true)} 
                        className="border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-600 transition-all duration-300 group min-h-[250px]"
                    >
                        <div className="p-4 rounded-full bg-slate-100 group-hover:bg-emerald-100 transition-colors mb-3">
                            <IconPlus />
                        </div>
                        <span className="font-bold text-lg">Thêm danh mục mới</span>
                        <span className="text-sm text-slate-400 mt-1">Tùy chỉnh chi tiêu của bạn</span>
                    </button>
                </div>
            )}
        </main>
        
        {/* Modals */}
        <AddCategoryModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={async (name, limit) => { await categoryService.create({name, limit}); fetchData(); setIsAddOpen(false); }} />
        <EditCategoryModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} category={selectedCategory} onSave={async (id, name, limit) => { await categoryService.update(id, {name, limit}); fetchData(); setIsEditOpen(false); }} />
        <DeleteCategoryModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} category={selectedCategory} onConfirm={async (id) => { await categoryService.delete(id); fetchData(); setIsDeleteOpen(false); }} />
        <SetBudgetModal isOpen={isBudgetOpen} onClose={() => setIsBudgetOpen(false)} onSave={async (m, y, l) => { await budgetService.set(m, y, l); alert("Đã lưu ngân sách!"); }} suggestedBudget={totalSuggestedBudget} />
    </div>
  );
}