import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveToken } from "../../Redux/userToken";
import PropTypes from "prop-types";
import "../../Assets/Styles/PlaylistForm.css";
import { Modal, Button, Input } from "antd";
import { fetchProfile } from "../../ConsumeAPI/FetchProfile";
import { createPlaylist } from "../../ConsumeAPI/CreatePlaylist";
import { addItemsToPlaylist } from "../../ConsumeAPI/AddItemToPlaylist";


PlaylistForm.propTypes = {
	selectedMusic: PropTypes.any,
};

function PlaylistForm ({selectedMusic}) {
	const { token } = useSelector((state) => state.userToken);
	const dispatch = useDispatch();
	const [playlistInfo, setPlaylistInfo] = useState({
		"name": "",
		"description": ""
	});
	const { TextArea } = Input;
    
	const handleFormPlaylist = (e) => {
		const { name, value } = e.target;
		setPlaylistInfo({...playlistInfo, [name]: value });
	};
    
	const handleCreatePlaylist = async (e) => {
		e.preventDefault();
		let userId = "";
		let playlistId = "";
		let snapshotId = "";
		if (!(userId = await fetchProfile(token))) {
			Modal.error({
				title: "Unauthorized Access",
				content: "Your session has expired, please Re-login to proceed.",
			});
			return dispatch(saveToken(""));
		}
		if (!(playlistId = await createPlaylist( token, userId.id, playlistInfo))) {
			Modal.error({
				title: "Unauthorized Access",
				content: "Your session has expired, please Re-login to proceed.",
			});
			return dispatch(saveToken(""));
		}
		if (!(snapshotId = await addItemsToPlaylist(token, playlistId, selectedMusic))) {
			Modal.error({
				title: "Unauthorized Access",
				content: "Your session has expired, please Re-login to proceed.",
			});
			return dispatch(saveToken(""));
		}
		// const playlistId = await createPlaylist(userId);
		// const snapshotId = await addItemsToPlaylist(playlistId);
		// alert(`Yout playlist has been added\nSnapshot: ${snapshotId.snapshot_id}`);
		if (snapshotId !== "") {
			Modal.success({
				content: "Your playlist has been added to your account.",
			});
		}
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
				<Button size="medium" shape="round" type="primary" htmlType="submit">Submit</Button>
			</form>
		</>
	);
}

export default PlaylistForm;