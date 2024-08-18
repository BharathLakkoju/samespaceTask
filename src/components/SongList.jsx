import { Loader2 } from 'lucide-react';
import React, { useRef, useEffect } from 'react';

function SongList({ songs, onSongClick, selectedSong, onDurationLoaded }) {
  return (
    <>
      <div className='overflow-y-auto h-[calc(100vh-10rem)]'>
        {songs.length > 0 ? (
          songs.map((song) => (
            <div
              key={song.id}
              className={`flex items-center p-4 mb-2 rounded-lg cursor-pointer ${song.id === selectedSong?.id ? 'bg-white/15' : 'hover:bg-white/15'}`}
              onClick={() => onSongClick(song)}
            >
              <img src={`https://cms.samespace.com/assets/${song.cover}`} alt="cover" className="w-16 h-16 mr-4 rounded-full shadow-lg" />
              <div className="flex flex-col justify-start">
                <span className="text-white font-bold">{song.name}</span>
                <span className='text-gray-400 text-sm'>{song.artist}</span>
              </div>
              <div className="flex items-center ml-auto text-gray-400 text-lg">
                <span>
                  {song.duration ? `${Math.floor(song.duration / 60)}:${Math.floor(song.duration % 60).toString().padStart(2, '0')}` : (<Loader2 className='animate-spin w-5 h-5' />)}
                  <AudioDurationExtractor url={song.url} onLoaded={(duration) => onDurationLoaded(song.id, duration)} />
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-96">
            <Loader2 className='animate-spin w-10 h-10 text-white' />
          </div>
        )}
      </div>
    </>
  );
}

function AudioDurationExtractor({ url, onLoaded }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        onLoaded(audioRef.current.duration);
      }
    };

    const audioElement = audioRef.current;
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [onLoaded]);

  return <audio ref={audioRef} src={url} preload="metadata" hidden />;
}

export default SongList;
