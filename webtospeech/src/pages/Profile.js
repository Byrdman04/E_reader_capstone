import '../styles/profile.css';
import pfp from '../resources/user-profile-icon.png';

function Profile() {
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
        </div>
    );
}

export default Profile;