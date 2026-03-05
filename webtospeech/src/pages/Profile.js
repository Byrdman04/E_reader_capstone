import '../styles/profile.css';
import pfp from '../resources/user-profile-icon.png';
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
            <div id="profile-banner">
                <div className="column">
                    {/*<h1>PFP Goes Here</h1>*/}
                    <img id="profile-picture" src={pfp} alt="User's profile icon"></img>
                    <p className="banner-text">User's Profile</p>
                </div>

                <div className="column">
                    <h1>Documents Uploaded</h1>
                    <p className="header-styling">42</p>
                </div>
            </div>

            <div id="profile-collections-table">

            </div>

            {/*<h1>This will be the Profile page</h1>
            <button onClick={loadDashboardPage}>Go to Dashboard</button>
            <button onClick={loadLoginPage}>Go to Login</button>*/}
        </div>
    );
}

export default Profile;