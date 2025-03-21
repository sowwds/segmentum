import { Routes, Route } from 'react-router-dom';
import Login from './components/pages/Login';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
  </Routes>
);
export default AppRoutes;
