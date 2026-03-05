import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();

    const loadDashboardPage = () => {
    navigate('/Dashboard');
    };

    const loadLoginPage = () => {
    navigate('/');
    };

    return (
        <div className="Profile">
            <h1>This will be the Profile page</h1>
            <button onClick={loadDashboardPage}>Go to Dashboard</button>
            <button onClick={loadLoginPage}>Go to Login</button>
        </div>
    );
}

export default Profile;