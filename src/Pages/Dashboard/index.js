import "../../Assets/Styles/Dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { saveToken } from "../../Redux/userToken";
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Button } from "antd";
// import sideImage from "../../Assets/Images/omid-armin-GIm5OV5rY0w-unsplash.jpg";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL = window.location.href;
const SPACE_DELIMITER = "%20";
const SCOPES = ["playlist-modify-private", "user-read-private"];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

function Dashboard() {
	const { token } = useSelector((state) => state.userToken);
	const dispatch = useDispatch();

	const getReturnSpotifyAuth = (hash) => {
		const stringAfterHash = hash.substring(1);
		const urlParams = stringAfterHash.split("&");
		const paramSplitUp = urlParams.reduce((accumulater, currentValue) => {
			const [key, value] = currentValue.split("=");
			accumulater[key] = value;
			return accumulater;
		}, {});
		dispatch(saveToken(paramSplitUp.access_token));
	};
    
	const handleLogin = () => {
		window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
	};

	useEffect(() => {
		if (window.location.hash) {
			getReturnSpotifyAuth(window.location.hash);
		}
	}, []);

	return (
		<>
			<div className="top-wrapper">
				<div className="side-info">
					<h1 className="landing-title">Create your own playlist on Spotify</h1>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ultricies et mauris a pulvinar. 
						Donec vitae diam metus. Aliquam eu varius libero. Donec non fringilla enim, non tincidunt felis. 
						Fusce libero ligula, sagittis a nunc ut, dignissim scelerisque odio. Praesent laoreet rhoncus magna at rutrum. 
						Nunc nunc lectus, hendrerit a.</p>
					{
						token !== "" ? <Redirect to="/create-playlist"/> : <p className="login-info">You need to login to proceed</p> 
					}
					<Button type="primary" shape="round" onClick={handleLogin}>Log In</Button>
				</div>
				<div className="side-image">
				</div>
			</div>
		</>
	);
}

export default Dashboard;