import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";
import CreatePlaylist from "./Pages/CreatePlaylist";
import Dashboard from "./Pages/Dashboard";

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/" exact>
					<Dashboard/>
				</Route>
				<Route path="/create-playlist" exact>
					<CreatePlaylist/>
				</Route>
			</Switch>  
		</Router>
	);
}

export default App;