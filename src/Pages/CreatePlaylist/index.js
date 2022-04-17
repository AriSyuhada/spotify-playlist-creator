import "../../Assets/Styles/App.css";
import "../../Assets/Styles/CreatePlaylist.css";
import Music from "../../Components/Music";
import SearchBar from "../../Components/SearchBar";
// import data from './data';
import React, { useState } from "react";
import PlaylistForm from "../../Components/PlaylistForm";
import { useSelector } from "react-redux";
import {
	Redirect
} from "react-router-dom";

function CreatePlaylist() {

	// const [musicData, setMusicData] = useState([]);
	const [selectedMusic, setSelectedMusic] = useState([]);
	const { token } = useSelector((state) => state.userToken);
	const { items } = useSelector((state) => state.musicsData);

	const selectMusic = (data) => {
		const tempArrMusicId = [...selectedMusic, data.uri];
		setSelectedMusic(tempArrMusicId);
	};

	const deselectMusic = (data) => {
		const index = selectedMusic.indexOf(data.uri);

		const tempArrMusicId = selectedMusic.concat([]);
		tempArrMusicId.splice(index, 1);
		setSelectedMusic(tempArrMusicId);
	};

	return (
		<div className="App">

			{
				token === "" ? <Redirect to="/"/> : <p>You&apos;re Logged in</p> 
			}

			<h1>Create your own playlist</h1>
			<PlaylistForm selectedMusic={selectedMusic} />
			<h3>Search and select your tracks first, before saving the playlist.</h3>
			<SearchBar />

			<div className="musics-wrapper">

				{
					items
						.filter((music) => {
							return selectedMusic.includes(music.uri);
						})
						.map((music) => {
							return <Music key={music.uri} data={music} select={selectMusic} deselect={deselectMusic} isSelected={true}/>;
						})
				}
				{
					items
						.filter((music) => {
							return !selectedMusic.includes(music.uri);
						})
						.map((music) => {
							return <Music key={music.uri} data={music} select={selectMusic} deselect={deselectMusic} isSelected={false}/>;
						})
				}

			</div>
			
		</div>
	);
}

export default CreatePlaylist;
