import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ExpensesPage from './pages/ExpensesPage';
import CategoriesPage from './pages/CategoriesPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/expenses" element={<ExpensesPage />} />
      <Route path="/categories" element={<CategoriesPage />} /> 
      <Route path="/reports" element={<ReportsPage />} />
    </Routes>
  );
}

export default App;