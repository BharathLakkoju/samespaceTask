import { PiFastForwardFill, PiRewindFill, PiPlayFill, PiPauseFill } from "react-icons/pi";
import { HiDotsHorizontal } from "react-icons/hi";
import { VolumeX } from 'lucide-react';
import { Volume2 } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';
import React from 'react';

function Player({ song, nextSong, prevSong }) {
  const audioRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMute, setIsMute] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
    setIsMute(!isMute);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSongEnd = () => {
    nextSong();
    setIsPlaying(true);
    setCurrentTime(0);
  };

  return (
    <div className="p-4 rounded-lg text-white flex flex-col items-center h-screen py-20">
      <div className='flex flex-col w-[480px] mb-4'>
        <span className="text-2xl font-bold mb-2">{song.name}</span>
        <span className="text-lg mb-4 text-gray-300">{song.artist}</span>
      </div>
      <img
        src={`https://cms.samespace.com/assets/${song.cover}`}
        alt={song.name}
        className="rounded-lg w-[480px] h-[510px] object-cover"
      />
      <audio
        autoPlay
        ref={audioRef}
        src={song.url}
        className="w-full"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleSongEnd}
      />
      <div className="w-[480px] mt-4">
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => {
            if (audioRef.current) {
              audioRef.current.currentTime = e.target.value;
            }
          }}
          className="w-full bg-gray-100 text-gray-800"
        />
      </div>
      <div className='flex justify-between w-[480px]'>
        <div className='mt-4 size-16 flex justify-center items-center bg-white/10 rounded-full p-2'>
          <HiDotsHorizontal className="w-10 h-10 text-white rounded-full p-2" />
        </div>
        <div className="mt-4 flex justify-center items-center">
          <button className="p-2" onClick={() => { prevSong(); setIsPlaying(true); }}>
            <PiRewindFill className="w-12 h-12 text-white rounded-full p-2" />
          </button>
          <button className="mx-2 p-2 bg-white rounded-full" onClick={handlePlayPause}>
            {isPlaying ? (<PiPauseFill className="w-10 h-10 text-black rounded-full p-2" />) : (<PiPlayFill className="w-10 h-10 text-black rounded-full p-2" />)}
          </button>
          <button className="p-2" onClick={() => { nextSong(); setIsPlaying(true); }}>
            <PiFastForwardFill className="w-12 h-12 text-white rounded-full p-2" />
          </button>
        </div>
        <button className="mt-4 p-2 size-16 flex items-center justify-center bg-white/10 rounded-full" onClick={handleMute}>
          {isMute ? (<VolumeX className="w-10 h-10 text-white rounded-full p-2" />) : (<Volume2 className="w-10 h-10 text-white rounded-full p-2" />)}
        </button>
      </div>
    </div>
  );
}

export default Player;
