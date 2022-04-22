import "../../Assets/Styles/App.css";
import "../../Assets/Styles/CreatePlaylist.css";
import Music from "../../Components/Music";
import SearchBar from "../../Components/SearchBar";
// import data from './data';
import React, { useEffect, useState } from "react";
import PlaylistForm from "../../Components/PlaylistForm";
import { useDispatch, useSelector } from "react-redux";
import { saveToken } from "../../Redux/userToken";
import { Redirect } from "react-router-dom";
import { fetchProfile } from "../../ConsumeAPI/FetchProfile";
import ReactLoading from "react-loading";
import { Collapse, Avatar, Popover, Modal, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

function CreatePlaylist () {

	// const [selectedMusicsURI, setSelectedMusicsURI] = useState([]);
	const [selectedMusicsData, setSelectedMusicsData] = useState([]);
	const [accountProfile, setAccountProfile] = useState({
		id : "",
		display_name : "",
		country : "",
		followers : 0,
		external_urls : "",
		images : ""
	});
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { token } = useSelector((state) => state.userToken);
	const { items } = useSelector((state) => state.musicsData);
	const dispatch = useDispatch();

	const { Panel } = Collapse;

	useEffect( async () => {
		let tempAccountProfile;
		if (!(tempAccountProfile = await fetchProfile(token))) {
			Modal.error({
				title: "Unauthorized Access",
				content: "Your session has expired, please Re-login to proceed.",
			});
			return dispatch(saveToken(""));
		}
		setAccountProfile({...accountProfile, 
			id : tempAccountProfile.id,
			display_name : tempAccountProfile.display_name,
			country : tempAccountProfile.country,
			followers : tempAccountProfile.followers.total,
			external_urls : tempAccountProfile.external_urls.spotify,
			images : tempAccountProfile.images[0].url
		});
	}, []);

	let selectedMusicsURI = selectedMusicsData.map((music) => {
		return music.uri;
	});

	const logout = () => {
		dispatch(saveToken(""));
	};

	const clearSelectedMusic = () => {
		setSelectedMusicsData([]);
	};

	const selectMusic = (data) => {
		const tempArrMusicData = [...selectedMusicsData, data];
		setSelectedMusicsData(tempArrMusicData);
	};

	const deselectMusic = (data) => {
		const index = selectedMusicsURI.indexOf(data.uri);

		const tempArrMusicData = selectedMusicsData.concat([]);
		tempArrMusicData.splice(index, 1);
		setSelectedMusicsData(tempArrMusicData);
	};

	return (
		<div className="App">

			<div className="page-content">
				{
					Object.keys(accountProfile).length === 0
						? <div className="loading-container">
							<ReactLoading color="#1fdf64"/>
						</div>
						: <>
							<div className="profile-wrapper">
								{token === "" 
									? <Redirect to="/"/>
									: <>
										<Avatar shape="square" src={accountProfile.images} />
										<Popover 
											className="profile-popover" 
											placement="bottom" 
											title={accountProfile.display_name + "'s Profile"} 
											content={(
												<div>
													<p>Country Code: {accountProfile.country}</p>
													<p>Followers Count: {accountProfile.followers}</p>
													<Button shape="round" href={accountProfile.external_urls}>
														Your Spotify Profile
													</Button>
													<Button onClick={logout} shape="round" type="primary" danger>
														Log Out
													</Button>
												</div>
											)} 
											trigger="click"
										>
											<Button>{accountProfile.id}</Button>
										</Popover>
									</>
								}
							</div>

							<h1 className="create-playlist-title">Create your playlist</h1>
							<h3 className="create-playlist-sub-title">Be creative. We&apos;re giving you a freedom to make your playlist. Search millions of music track from spotify API. Select some tracks that you want. Give your playlist a title and description. Submit it, and we&apos;ll handle the rest.</h3>

							<Button type="primary" shape="round" onClick={() => setIsModalVisible(true)}>
								Create a Playlist
							</Button>
							<Modal
								title="Vertically centered modal dialog"
								centered
								visible={isModalVisible}
								onCancel={() => setIsModalVisible(false)}
								footer={[
									<Button key="back" shape="round" onClick={() => setIsModalVisible(false)}>
										Cancel
									</Button>
								]}
							>
								<PlaylistForm selectedMusic={selectedMusicsURI} />
							</Modal>

							<SearchBar />

							<div className="musics-wrapper">

								{
									items
										.filter((music) => {
											return selectedMusicsURI.includes(music.uri);
										})
										.map((music) => {
											return <Music key={music.uri} data={music} select={selectMusic} deselect={deselectMusic} isSelected={true}/>;
										})
								}
								{
									items
										.filter((music) => {
											return !selectedMusicsURI.includes(music.uri);
										})
										.map((music) => {
											return <Music key={music.uri} data={music} select={selectMusic} deselect={deselectMusic} isSelected={false}/>;
										})
								}

							</div>
						</>
				}
			</div>

			<div className="collapse-menu">
				<Collapse accordion>
					<Panel key={1}>
						<Button className="clear-button" onClick={() => clearSelectedMusic()} type="primary" shape="round" danger >Clear Selection</Button>
						{
							selectedMusicsData.map((music) => {
								return (
									<>
										<div key={music.uri} className="selected-song-wrapper">
											<div className="selected-song-info-wrapper">
												<p>{music.name} - {music.artists[0].name}</p>
											</div>
											<Button className="deselect-song-button" onClick={() => deselectMusic(music)} shape="circle" icon={<CloseOutlined />} danger />
										</div>
									</>
								);
							})
						}
					</Panel>
				</Collapse>
			</div>

		</div>
	);
}

export default CreatePlaylist;
