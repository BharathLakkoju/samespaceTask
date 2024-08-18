import React, { useState, useEffect, useTransition } from 'react';
import axios from 'axios';
import SongList from './components/SongList';
import Player from './components/Player';
import spotify from "./assets/spotify.png"
import { Loader2 } from 'lucide-react';
import { PersonIcon } from '@radix-ui/react-icons';

function App() {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('forYou');
  const [loading, setLoading] = useTransition();

  useEffect(() => {
    // Fetch songs from the API
    setLoading(() => {
      axios.get('https://cms.samespace.com/items/songs')
        .then(response => setSongs(response.data.data.map(song => ({
          ...song,
          duration: 0,
        }))
        ))
        .catch(error => console.error('Error fetching data:', error));
    })
  }, []);

  const filteredSongs = songs.filter(song =>
    song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const forYouSongs = filteredSongs;
  const topTracks = filteredSongs.filter(song => song.top_track);

  const handleSongClick = (song) => {
    setSelectedSong(song);

  };

  const foryounextSong = () => {
    const currentIndex = forYouSongs.findIndex(song => song.id === selectedSong.id);
    const nextIndex = (currentIndex + 1) % forYouSongs.length;
    setSelectedSong(forYouSongs[nextIndex]);
  };
  const foryouprevSong = () => {
    const currentIndex = forYouSongs.findIndex(song => song.id === selectedSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % forYouSongs.length;
    setSelectedSong(forYouSongs[prevIndex]);
  };
  const toptracksnextsong = () => {
    const currentIndex = topTracks.findIndex(song => song.id === selectedSong.id);
    const nextIndex = (currentIndex + 1) % topTracks.length;
    setSelectedSong(topTracks[nextIndex]);
  };
  const toptracksprevsong = () => {
    const currentIndex = topTracks.findIndex(song => song.id === selectedSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % topTracks.length;
    setSelectedSong(topTracks[prevIndex]);
  };
  const handleDurationLoaded = (id, duration) => {
    setSongs(prevSongs =>
      prevSongs.map(song => song.id === id ? { ...song, duration } : song)
    );
  };

  return (
    <div
      className="h-screen flex w-screen gap-10"
      style={{
        background: selectedSong
          ? `linear-gradient(to bottom right, ${selectedSong.accent}, black)`
          : 'black',
        transformOrigin: 'top left',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <div className="flex flex-col justify-between w-[400px]">
        <img src={spotify} alt="logo" className='w-[16rem] h-[5rem] m-5' />
        <PersonIcon className='w-10 h-10 text-white bg-gray-500 rounded-full p-2 m-10' />
      </div>
      <div className="w-[500px]">
        <div className="mb-4">
          <button
            className={`p-2 ${activeTab === 'forYou' ? 'text-white' : 'text-gray-400'} text-xl font-bold`}
            onClick={() => setActiveTab('forYou')}
          >
            For You
          </button>
          <button
            className={`p-2 ${activeTab === 'topTracks' ? 'text-white' : 'text-gray-400'} text-xl font-bold`}
            onClick={() => setActiveTab('topTracks')}
          >
            Top Tracks
          </button>
        </div>
        <div className="flex justify-center items-center mb-6 w-[400px]">
          <input
            type="text"
            placeholder="Search Song, Artist"
            className={`p-2 rounded-md bg-white/15 text-white w-full h-12 px-5 placeholder:text-gray-200 focus:outline-none`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {loading ? (
          <Loader2 className='animate-spin w-10 h-10' />
        ) : (
          <SongList
            songs={activeTab === 'forYou' ? forYouSongs : topTracks}
            onSongClick={handleSongClick}
            selectedSong={selectedSong}
            onDurationLoaded={handleDurationLoaded}
          />
        )}
      </div>
      {selectedSong ? (
        <div className="w-1/2">
          <Player song={selectedSong} nextSong={activeTab === 'foryou' ? foryounextSong : toptracksnextsong} prevSong={activeTab === 'foryou' ? foryouprevSong : toptracksprevsong} />
        </div>
      ) : (
        <div className="w-1/3 h-11/12 flex justify-center items-center">
          <p className="text-gray-400">Select a song to play</p>
        </div>
      )}
    </div>
  );
}

export default App;
