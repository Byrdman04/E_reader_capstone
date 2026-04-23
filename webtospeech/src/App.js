import ReactTemplate from './pages/ReactTemplate';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Document from './pages/Document'
import Profile from './pages/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={ <ProtectedRoute><Dashboard /></ProtectedRoute> } />
      <Route path="/document/:id" element={ <ProtectedRoute><Document /></ProtectedRoute> } />
      <Route path="/profile" element={ <ProtectedRoute><Profile /></ProtectedRoute> } />
      <Route path="/reactTemplate" element={ <ProtectedRoute><ReactTemplate /></ProtectedRoute> } />
    </Routes>
  );
}

export default App;
