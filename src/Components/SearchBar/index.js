import "../../Assets/Styles/SearchBar.css";
import React from "react";

function SearchBar({handleInput, handleSearch}) {

	return (
		<>
			<form className='SearchBar' onSubmit={handleSearch}>
				<input onChange={handleInput} type="text" />
				<input type="submit" value="Search" />
			</form>
		</>
	);
    
}

export default SearchBar;