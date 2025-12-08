import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from '../assets/lmao.jpg'; 
import { authService } from '../service/authService';

// --- ICONS (Giữ nguyên để đồng bộ) ---
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const LockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>);
const EyeIcon = ({ visible }) => (
  visible ? 
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> :
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
);

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const res = await authService.login({ username, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/'); 
    } catch (error) {
      alert(error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <div 
      className="flex min-h-screen w-full items-center justify-center bg-cover bg-center font-sans" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      {/* Main Container */}
      <div className="relative z-10 flex w-full max-w-6xl flex-col justify-center p-4 lg:flex-row lg:gap-12 xl:gap-20">
        
        {/* --- PHẦN 1: FORM ĐĂNG NHẬP (BÂY GIỜ NẰM BÊN TRÁI) --- */}
        {/* lg:justify-end: Đẩy form về phía bên phải của cột trái (tức là về giữa màn hình) */}
        <div className="flex w-full items-center justify-center lg:w-1/2 lg:justify-end">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-green-900/20">
            
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800">Chào mừng trở lại</h1>
              <p className="mt-2 text-sm text-gray-500">Đăng nhập để tiếp tục quản lý tài chính</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Username Input */}
              <div className="group relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 transform transition-colors group-focus-within:text-green-600">
                  <UserIcon />
                </div>
                <input 
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-10 py-3 text-gray-700 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10" 
                  type="text" 
                  placeholder="Tên đăng nhập / Email" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
              
              {/* Password Input */}
              <div className="group relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 transform transition-colors group-focus-within:text-green-600">
                  <LockIcon />
                </div>
                <input 
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-10 py-3 text-gray-700 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Mật khẩu" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button 
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer p-1 outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    <EyeIcon visible={showPassword} />
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline">
                      Quên mật khẩu?
                  </Link>
              </div>
              
              {/* Login Button */}
              <button 
                className="w-full transform rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-3.5 font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-green-500 hover:to-emerald-500 hover:shadow-xl active:scale-95" 
                type="submit"
              >
                ĐĂNG NHẬP
              </button>
            </form>
            
            {/* Footer */}
            <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <p className="text-sm text-gray-500">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="font-bold text-green-600 hover:text-green-700 hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* --- PHẦN 2: BRANDING / CHỮ (BÂY GIỜ NẰM BÊN PHẢI) --- */}
        {/* text-left: Để chữ căn lề trái (hướng về phía form) */}
        {/* lg:justify-start: Đẩy nội dung về phía bên trái của cột phải (về giữa màn hình) */}
        <div className="hidden w-1/2 flex-col justify-center items-start text-left lg:flex lg:pl-10">
          <div className="mb-6 drop-shadow-2xl">
            <h2 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-green-300 tracking-wide">
              EconoMe
            </h2>
          </div>
          <div className="text-white space-y-2 drop-shadow-lg">
            <p className="text-2xl font-light italic opacity-90">"Kiểm soát chi tiêu,</p>
            <p className="text-4xl font-bold tracking-tight text-green-400">Tối ưu cuộc sống"</p>
          </div>
          {/* Decorative Elements */}
          <div className="mt-8 flex gap-2">
            <span className="h-1 w-16 rounded-full bg-green-500"></span>
            <span className="h-1 w-4 rounded-full bg-white/50"></span>
            <span className="h-1 w-4 rounded-full bg-white/50"></span>
          </div>
        </div>

      </div>
    </div>
  );
}