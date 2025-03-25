import { Routes, Route } from 'react-router-dom';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import Projects from './components/pages/Projects';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/projects/new" element={<Projects />} />
    <Route path="/projects/:id" element={<Projects />} />
  </Routes>
);

export default AppRoutes;
