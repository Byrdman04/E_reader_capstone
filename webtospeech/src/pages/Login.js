import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const loadLoginPage = () => {
    navigate('/reactTemplate');
  };

  return (
      <div className="Login">
       <h1>This will be the Login page</h1>

       <button onClick={loadLoginPage}>Go to ReactTemplate</button>
      </div>
  );
}

export default Login;