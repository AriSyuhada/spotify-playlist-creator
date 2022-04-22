export const fetchProfile = async (token) => {
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
				return false;
				// throw new Error("Unauthorized access, please login first");
			case 403:
				throw new Error("Forbidden access");
			default:
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		} else {
			const userData = await response.json();
			return userData;
		}
	} catch (error) {
		console.log(`There has been a problem with your fetch operation: ${error.message}`);
	}
};