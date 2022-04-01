import '../../Assets/Styles/App.css';
import Music from '../../Components/Music';
// import SearchBar from '../../Components/SearchBar';
// import data from './data';
import React, { useEffect, useState } from 'react';

// https://accounts.spotify.com/authorize?response_type=token&client_id=&scope=&redirect_uri=&state=

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL = "http://localhost:3000/";
const SPACE_DELIMITER = "%20";
const SCOPES = ["playlist-modify-private", "user-read-private"];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

function App() {

  const [authToken, setAuthToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [musicData, setMusicData] = useState([]);
  const [isDataExist, setIsDataExist] = useState(false);
  const [isAuthorize, setIsAuthorize] = useState(false);
  // const [selectedMusic, setSelectedMusic] = useState({
  //   'id': [],
  //   'tracks': [],
  // });
  const [selectedMusic, setSelectedMusic] = useState([]);

  const getReturnSpotifyAuth = (hash) => {
    const stringAfterHash = hash.substring(1);
    const urlParams = stringAfterHash.split("&");
    const paramSplitUp = urlParams.reduce((accumulater, currentValue) => {
      const [key, value] = currentValue.split("=");
      accumulater[key] = value;
      return accumulater;
    }, {});
    setAuthToken(paramSplitUp.access_token);
    setIsAuthorize(true);
  }
  
  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  }

  const handleInput = (e) => {
    setSearchKey(e.target.value);
  }

  const handleSearch = async () => {
    const url = "https://api.spotify.com/v1/search";
    const keywords = searchKey;
    const type = "track";
    try {
      const response = await fetch(`${url}?q=${keywords}&type=${type}&limit=10`, {
        headers: {
          'Authorization' : 'Bearer ' + authToken
        }
      })
      if (!response.ok) {
        switch (response.status) {
          case 401:
            throw new Error(`Unauthorized access, please login first`);
            break;
          case 403:
            throw new Error(`Forbidden access`);
            break;
          default:
            throw new Error(`HTTP error! status: ${response.status}`);
            break;
        }
      } else {
        const musicData = await response.json()
        setMusicData(musicData.tracks.items);
        setIsDataExist(true);
      }
    } catch (error) {
      alert(`There has been a problem with your fetch operation: ${error.message}`);
    }
  }

  // const usePrevious = (value) => {
  //   const ref = useRef();

  //   useEffect(() => {
  //     ref.current = value;
  //   }, [value]);

  //   return ref.current;
  // }

  const selectMusic = (data) => {
    // const tempArrMusic = [...selectedMusic.tracks, data];
    const tempArrMusicId = [...selectedMusic, data.uri];

    // setSelectedMusic({
    //   'id' : tempArrMusicId,
    //   'tracks' : tempArrMusic,
    // });
    setSelectedMusic(tempArrMusicId);
  }

  const deselectMusic = (data) => {
    const index = selectedMusic.id.indexOf(data.uri);

    // const tempArrMusic = selectedMusic.tracks;
    // tempArrMusic.splice(index, 1);
    const tempArrMusicId = selectedMusic;
    tempArrMusicId.splice(index, 1);

    // setSelectedMusic({
    //   'id' : tempArrMusicId,
    //   'tracks' : tempArrMusic,
    // });
    setSelectedMusic(tempArrMusicId);
  }

  useEffect(() => {
    if (window.location.hash) {
      getReturnSpotifyAuth(window.location.hash);
    }
  }, []);

  return (
    <div className="App">
      <h1>Search your Track</h1>
      <button onClick={handleLogin}>Login to Spotify</button>
      <form className='SearchBar' onSubmit={handleSearch}>
          <input onChange={handleInput} type="text" />
          <input type="submit" value="Search" />
      </form>
      {!isAuthorize && 
        <><p>You need to login to access this feature</p></>
      }
      <div className='musics-wrapper'>
        {/* {
          selectedMusic.tracks.map((music) => {
            return <Music key={music.uri} data={music} select={selectMusic} deselect={deselectMusic} isSelected={true}/>
          })
        } */}
        {/* {isDataExist &&
          musicData
          .filter((music) => {
            return !selectedMusic.id.includes(music.uri);
          })
          .map((music) => {
            return <Music key={music.uri} data={music} select={selectMusic} deselect={deselectMusic} isSelected={false}/>
          })
        } */}
        {
          musicData.map((music) => {
            return selectedMusic.includes(music.uri)
            ? <Music key={music.uri} data={music} select={selectMusic} deselect={deselectMusic} isSelected={true}/>
            : <Music key={music.uri} data={music} select={selectMusic} deselect={deselectMusic} isSelected={false}/>
          })
        }
      </div>
    </div>
  );
}

export default App;
