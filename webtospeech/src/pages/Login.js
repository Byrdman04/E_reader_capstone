import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import  {supabase}  from '../supabaseClient'
import LoginMenu from '../components/LoginMenu'


function Login() {
  const navigate = useNavigate();

  const loadLoginPage = () => {
    navigate('/reactTemplate');
  };

  const loadDashboardPage = () => {
    navigate('/dashboard');
  }

  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <>
      <div className="Login">
       <h1>This will be the Login page</h1>

       <button onClick={loadLoginPage}>Go to ReactTemplate</button>
      </div>

      
      {session ? (
        <div>
          <h2>Welcome {session.user.email}</h2>
          <button onClick={() => supabase.auth.signOut()}>
            Logout
          </button>
          <button onClick={loadDashboardPage}>Go to Dashboard</button>
        </div>
      ) : (
        <LoginMenu />
      )}
    </>
  );
}

export default Login;
