import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import LoginMenu from '../components/LoginMenu';
import './Login.css';

function Login() {
  sessionStorage.clear();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          navigate('/dashboard');
        }
      }
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="login-container">
      {/* Top Header Bar */}
      <header className="login-header">
        <span className="logo-text-top">WebToSpeech</span>
      </header>

      {/* Main Content Area */}
      <main className="login-main">
        <div className="logo-circle">
        
          <img src="WebToSpeech Logo.png" alt="WebToSpeech Logo" className="main-logo" />
        </div>

        <p className="welcome-text">
          Welcome to WebToSpeech! the all in one document storage and Text to Speech reader solution!
        </p>

        <div className="auth-section">
        
          <LoginMenu />
        </div>
      </main>

      {/* Bottom Footer Bar */}
      <footer className="login-footer"></footer>
    </div>
  );
}

export default Login;