import React, { useState } from 'react';
import backgroundImage from '../assets/lmao.jpg';


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Tài khoản:', username);
    console.log('Mật khẩu:', password);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center
     bg-cover bg-center"
  style={{ backgroundImage: `url(${backgroundImage})` }} >
    
    
    
      <div className="w-full max-w-md rounded-lg bg-white bg-opacity-90 p-8 shadow-xl backdrop-blur-sm">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Đăng Nhập
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="username"
            >
              Tài khoản
            </label>
            <input
              className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="username"
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <input
              className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>


          <button
            className="w-full rounded bg-yellow-600 px-4 py-2 font-bold text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            type="submit"
          >
            Đăng Nhập
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">HOẶC</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="space-y-4">
          <button className="flex w-full items-center justify-center rounded bg-white px-4 py-2 font-bold text-gray-700 shadow-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg
              className="mr-3 h-5 w-5"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.79 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.48c1.63 0 3.09.58 4.23 1.7l3.06-3.06C17.46 2.1 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Đăng nhập bằng Google
          </button>

          <button className="flex w-full items-center justify-center rounded bg-[#1877F2] px-4 py-2 font-bold text-white shadow-md hover:bg-[#166FE5] focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg
              className="mr-3 h-5 w-5"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M24 12.07C24 5.4 18.6 0 12 0S0 5.4 0 12.07C0 18.09 4.39 23.1 10.13 24v-8.43H7.08v-3.49h3.05V9.4c0-3.02 1.8-4.69 4.56-4.69 1.3 0 2.68.23 2.68.23v2.97h-1.5c-1.48 0-1.96.93-1.96 1.88v2.26h3.3l-.53 3.5h-2.77V24C19.61 23.1 24 18.09 24 12.07Z" />
            </svg>
            Đăng nhập bằng Facebook
          </button>
      </div>
      </div>
    </div>
  );
}