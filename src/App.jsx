import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import ActiveSprint from './pages/ActiveSprint/ActiveSprint';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import './App.scss';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">Jira Clone</div>
        <nav className="app-nav">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            Рабочий стол
          </NavLink>
          <NavLink
            to="/sprint"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Активный спринт
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Панель администратора
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sprint" element={<ActiveSprint />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;