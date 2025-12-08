import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from '../assets/lmao.jpg'; 
import { authService } from '../service/authService';

// Component Icon nhỏ để code gọn hơn
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const MailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const LockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>);
const EyeIcon = ({ visible }) => (
  visible ? 
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> :
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
);

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State hiện password
  
  const navigate = useNavigate();

  const isLengthValid = password.length >= 8;
  const isMatch = password === confirmPassword && password !== '';
  
  const showLengthError = password.length > 0 && !isLengthValid;
  const showMatchError = confirmPassword.length > 0 && !isMatch;
  const showMatchSuccess = confirmPassword.length > 0 && isMatch;

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!isLengthValid || !isMatch) return;

    try {
      await authService.register({ username, email, password });
      alert("Đăng ký thành công! Hãy đăng nhập ngay.");
      navigate('/login'); 
    } catch (error) {
      alert(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div 
      className="flex min-h-screen w-full items-center justify-center bg-cover bg-center font-sans" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Lớp phủ tối màu để chữ và form nổi bật hơn trên nền ảnh */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <div className="relative z-10 flex w-full max-w-6xl flex-col justify-center p-4 lg:flex-row lg:gap-12 xl:gap-20">
        
        {/* --- LEFT SIDE: BRANDING --- */}
        <div className="hidden w-1/2 flex-col justify-center items-end text-right lg:flex">
          <div className="mb-6 drop-shadow-2xl">
            <h2 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-white tracking-wide">
              EconoMe
            </h2>
          </div>
          <div className="text-white space-y-2 drop-shadow-lg">
            <p className="text-2xl font-light italic opacity-90">"Vững vàng tài chính,</p>
            <p className="text-4xl font-bold tracking-tight text-green-400">Tự do cuộc đời"</p>
          </div>
          <div className="mt-8 flex gap-2">
            <span className="h-1 w-16 rounded-full bg-green-500"></span>
            <span className="h-1 w-4 rounded-full bg-white/50"></span>
            <span className="h-1 w-4 rounded-full bg-white/50"></span>
          </div>
        </div>

        {/* --- RIGHT SIDE: GLASS FORM --- */}
        <div className="flex w-full items-center justify-center lg:w-1/2 lg:justify-start">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-green-900/20">
            
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800">Tạo Tài Khoản</h1>
              <p className="mt-2 text-sm text-gray-500">Bắt đầu hành trình quản lý tài chính ngay hôm nay</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              
              {/* Username Input */}
              <div className="group relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 transform transition-colors group-focus-within:text-green-600">
                  <UserIcon />
                </div>
                <input 
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-10 py-3 text-gray-700 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10" 
                  type="text" 
                  placeholder="Tên đăng nhập" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>

              {/* Email Input */}
              <div className="group relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 transform transition-colors group-focus-within:text-green-600">
                  <MailIcon />
                </div>
                <input 
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-10 py-3 text-gray-700 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10" 
                  type="email" 
                  placeholder="Địa chỉ Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="group relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 transform transition-colors group-focus-within:text-green-600">
                    <LockIcon />
                  </div>
                  <input 
                    className={`w-full rounded-xl border bg-gray-50 px-10 py-3 text-gray-700 outline-none transition-all focus:bg-white focus:ring-4 ${
                      showLengthError 
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' 
                      : 'border-gray-200 focus:border-green-500 focus:ring-green-500/10'
                    }`}
                    type={showPassword ? "text" : "password"} 
                    placeholder="Mật khẩu" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
                {password.length > 0 && (
                   <p className={`ml-1 mt-1 text-xs font-medium ${isLengthValid ? 'text-green-600' : 'text-red-500'}`}>
                      {isLengthValid ? '✅ Đủ độ dài an toàn' : '⚠️ Mật khẩu cần tối thiểu 8 ký tự'}
                   </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <div className="group relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 transform transition-colors group-focus-within:text-green-600">
                    <LockIcon />
                  </div>
                  <input 
                    className={`w-full rounded-xl border bg-gray-50 px-10 py-3 text-gray-700 outline-none transition-all focus:bg-white focus:ring-4 ${
                      showMatchError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 
                      showMatchSuccess ? 'border-green-400 focus:border-green-500 focus:ring-green-500/10' : 
                      'border-gray-200 focus:border-green-500 focus:ring-green-500/10'
                    }`}
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                  />
                </div>
                {confirmPassword.length > 0 && (
                    <div className="ml-1 mt-1 text-xs font-medium">
                        {showMatchError && <span className="text-red-500">❌ Mật khẩu chưa trùng khớp</span>}
                        {showMatchSuccess && <span className="text-green-600">✅ Mật khẩu đã trùng khớp</span>}
                    </div>
                )}
              </div>

              {/* Submit Button */}
              <button 
                className={`w-full transform rounded-xl py-3.5 font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 ${
                    isLengthValid && isMatch 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500' 
                    : 'cursor-not-allowed bg-gray-300'
                }`} 
                type="submit" 
                disabled={!isLengthValid || !isMatch}
              >
                ĐĂNG KÝ NGAY
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Đã là thành viên?{' '}
                <Link to="/login" className="font-bold text-green-600 hover:text-green-700 hover:underline">
                  Đăng nhập tại đây
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}