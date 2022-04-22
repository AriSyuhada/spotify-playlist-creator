export const createPlaylist = async (token, userID, playlistInfo) => {
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
				return false;
				// throw new Error("Unauthorized access, please login first");
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
		console.log(`There has been a problem with your post data operation: ${error.message}`);
	}
};