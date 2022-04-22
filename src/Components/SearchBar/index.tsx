import "../../Assets/Styles/SearchBar.css";
// import PropTypes from "prop-types";
import type { RootState, AppDispatch } from "../../Redux/store";
import React, { useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { saveMusics } from "../../Redux/musicsData";
import { Input } from "antd";

// SearchBar.propTypes = {
// 	handleInput: PropTypes.func,
// 	handleSearch: PropTypes.func,
// };

function SearchBar() {

	const useAppDispatch = () => useDispatch<AppDispatch>();
	const dispatch = useAppDispatch();
	const selector: TypedUseSelectorHook<RootState> = useSelector;

	const { Search } = Input;
	const [searchKey, setSearchKey] = useState("");
	const { token } = selector((state) => state.userToken);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchKey(e.target.value);
	};

	const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const url = "https://api.spotify.com/v1/search";
		const keywords = searchKey;
		const type = "track";
		try {
			const response = await fetch(`${url}?q=${keywords}&type=${type}&limit=15`, {
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
				const musicData = await response.json();
				dispatch(saveMusics(musicData.tracks.items));
			}
		} catch (error) {
			alert(`There has been a problem with your fetch operation: ${error.message}`);
		}
	};

	return (
		<>
			<form className='SearchBar' onSubmit={handleSearch}>
				<Search placeholder="Search your musics..." onChange={handleInput} />
			</form>
		</>
	);
    
}

export default SearchBar;