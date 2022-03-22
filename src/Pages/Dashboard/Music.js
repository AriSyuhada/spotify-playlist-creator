import '../../Assets/Styles/Music.css';
import data from './data';

function Music() {
    return (
        <div className='Music'>
            <div className='music-img'>
                <img src={data.album.images[0].url}/>
            </div>
            <div className='music-info'>
                <p className='music-title'>{data.name}</p>
                <p className='music-artist'>{data.artists[0].name}</p>
            </div>
            <div>
                <button className='btn select'>Select</button>
            </div>
        </div>
    );
}

export default Music;