export const addItemsToPlaylist = async (token, playlistId, selectedMusic) => {
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
				return false;
				// throw new Error("Unauthorized access, please login first");
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
		console.log(`There has been a problem with your post data operation: ${error.message}`);
	}
};