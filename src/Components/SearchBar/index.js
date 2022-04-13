import "../../Assets/Styles/SearchBar.css";
import PropTypes from "prop-types";
import React from "react";
import { Input } from "antd";

SearchBar.propTypes = {
	handleInput: PropTypes.func,
	handleSearch: PropTypes.func,
};

function SearchBar({handleInput, handleSearch}) {

	const { Search } = Input;

	return (
		<>
			<form className='SearchBar' onSubmit={handleSearch}>
				<Search placeholder="input search text" onChange={handleInput} />
			</form>
		</>
	);
    
}

export default SearchBar;