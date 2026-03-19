import ReactTemplate from './pages/ReactTemplate';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Document from './pages/Document'
import Profile from './pages/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/document" element={<Document />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/reactTemplate" element={<ReactTemplate />} />
    </Routes>
  );
}

export default App;
