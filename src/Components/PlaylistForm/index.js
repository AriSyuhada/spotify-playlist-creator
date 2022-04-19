import React, { useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import "../../Assets/Styles/PlaylistForm.css";
import { Button, Input } from "antd";


PlaylistForm.propTypes = {
	selectedMusic: PropTypes.any,
};

function PlaylistForm ({selectedMusic}) {
	const { token } = useSelector((state) => state.userToken);
	const [playlistInfo, setPlaylistInfo] = useState({
		"name": "",
		"description": ""
	});
	const { TextArea } = Input;
    
	const handleFormPlaylist = (e) => {
		const { name, value } = e.target;
		setPlaylistInfo({...playlistInfo, [name]: value });
	};
    
	const fetchProfile = async () => {
		const url = "https://api.spotify.com/v1/me";
		try {
			const response = await fetch(`${url}`, {
				headers: {
					"Authorization" : "Bearer " + token
				}
			});
    
			if (!response.ok) {
				switch (response.status) {
				case 401:
					throw new Error("Unauthorized access, please login first");
				case 403:
					throw new Error("Forbidden access");
				default:
					throw new Error(`HTTP error! status: ${response.status}`);
				}
			} else {
				const userData = await response.json();
				return userData.id;
			}
		} catch (error) {
			alert(`There has been a problem with your fetch operation: ${error.message}`);
		}
	};
    
	const createPlaylist = async (userID) => {
		const url = "https://api.spotify.com/v1/users/";
		const playlistParam = {
			...playlistInfo,
			"public": false,
			"collaborative": false
		};
		try {
			const response = await fetch(`${url}${userID}/playlists`, {
				method: "POST",
				headers: {
					"Authorization" : "Bearer " + token,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(playlistParam)
			});
    
			if (!response.ok) {
				switch (response.status) {
				case 401:
					throw new Error("Unauthorized access, please login first");
				case 403:
					throw new Error("Forbidden access");
				default:
					throw new Error(`HTTP error! status: ${response.status}`);
				}
			} else {
				const playlistData = await response.json();
				return playlistData.id;
			}
		} catch (error) {
			alert(`There has been a problem with your post data operation: ${error.message}`);
		}
	};
    
	const addItemsToPlaylist = async (playlistId) => {
		const url = "https://api.spotify.com/v1/playlists/";
		const tracksParam = {"uris": selectedMusic};
		try {
			const response = await fetch(`${url}${playlistId}/tracks`, {
				method: "POST",
				headers: {
					"Authorization" : "Bearer " + token,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(tracksParam)
			});
    
			if (!response.ok) {
				switch (response.status) {
				case 401:
					throw new Error("Unauthorized access, please login first");
				case 403:
					throw new Error("Forbidden access");
				default:
					throw new Error(`HTTP error! status: ${response.status}`);
				}
			} else {
				const addedTracks = await response.json();
				return addedTracks;
			}
		} catch (error) {
			alert(`There has been a problem with your post data operation: ${error.message}`);
		}
	};
    
	const handleCreatePlaylist = async (e) => {
		e.preventDefault();
		const userId = await fetchProfile(token);
		const playlistId = await createPlaylist(userId);
		const snapshotId = await addItemsToPlaylist(playlistId);
		alert(`Yout playlist has been added\nSnapshot: ${snapshotId.snapshot_id}`);
	};
    
	return (
		<>
			<form className='playlist-form' action="" onSubmit={handleCreatePlaylist}>
				<label htmlFor="input-name">Playlist Name</label>
				<Input id='input-name' className='input text' onChange={handleFormPlaylist} name="name" required allowClear />
				<label htmlFor="input-desc">Playlist Description</label>
				{/* <textarea id='input-desc' className='input textarea' onChange={handleFormPlaylist} type="textarea" name="description" minLength={10} required/> */}
				<TextArea id='input-desc' className='input textarea' onChange={handleFormPlaylist} name="description" minLength={10} required allowClear />
				{/* <input className='input submit' type="submit" value="Save Playlist" /> */}
				<Button size="medium" htmlType="submit">Submit</Button>
			</form>
		</>
	);
}

export default PlaylistForm;