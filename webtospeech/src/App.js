import ReactTemplate from './pages/ReactTemplate';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/reactTemplate" element={<ReactTemplate />} />
    </Routes>
  );
}

export default App;
