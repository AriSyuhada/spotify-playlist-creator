import '../../Assets/Styles/App.css';
import Music from './Music';

function App() {
  return (
    <div className="App">
      <div className='musics-wrapper'>
        <h1>Your Playlist</h1>
        <Music/>
        <Music/>
        <Music/>
        <Music/>
      </div>
    </div>
  );
}

export default App;
