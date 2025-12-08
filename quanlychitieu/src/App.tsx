import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import ExpensesPage from './pages/ExpensesPage';
import ReportsPage from './pages/ReportsPage';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('user');
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/categories" 
          element={
            <PrivateRoute>
              <CategoriesPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/expenses" 
          element={
            <PrivateRoute>
              <ExpensesPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <PrivateRoute>
              <ReportsPage />
            </PrivateRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;