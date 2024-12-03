import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Upload, Volume2, VolumeX, List, Music } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Mở rộng danh sách phát mặc định
  const DEFAULT_PLAYLIST = [
    { title: 'Forest Lullaby', path: 'Forest Lullaby.mp3' },
    { title: 'Just Relax', path: 'Just Relax.mp3' },
    { title: 'Morning Chill', path: 'Morning Chill.mp3' },
    { title: 'Perfect Beauty', path: 'Perfect Beauty.mp3' },
    { title: 'The Beat Of Nature', path: 'The Beat Of Nature.mp3' }
  ];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setAudioSrc(fileURL);
      
      if (audioRef.current) {
        audioRef.current.src = fileURL;
        audioRef.current.play().catch(error => {
          console.error("Playback failed:", error);
        });
        setIsPlaying(true);
      }
    }
  };

  const selectTrack = (index: number) => {
    setSelectedTrackIndex(index);
    setAudioSrc(DEFAULT_PLAYLIST[index].path);
    setShowPlaylist(false);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = e.nativeEvent.offsetX;
      const progressBarWidth = progressBar.clientWidth;
      const seekTime = (clickPosition / progressBarWidth) * audioRef.current.duration;
      
      audioRef.current.currentTime = seekTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    if (!audioSrc) {
      setAudioSrc(DEFAULT_PLAYLIST[0].path);
    }
  }, []);

  useEffect(() => {
    // Auto play when audio source is set
    if (audioSrc && audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(error => {
        console.error("Autoplay failed:", error);
      });
      setIsPlaying(true);
    }
  }, [audioSrc]);

  useEffect(() => {
    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setShowPlaylist(false);
    };

    const container = playerContainerRef.current;
    if (container) {
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <div 
      ref={playerContainerRef}
      className="fixed bottom-28 left-24 z-50"
    >
      {/* Biểu tượng nhạc luôn hiển thị */}
      <div className="cursor-pointer">
        <Music 
          size={32} 
          className={`text-gray-600 hover:text-gray-900 transition-all duration-300 
            ${isVisible ? 'opacity-0' : 'opacity-100'}`} 
        />
      </div>

      {/* Player với hiệu ứng mượt mà */}
      <div 
        className={`mt-2 bg-teal-100 rounded-2xl shadow-2xl p-4 w-64 border border-gray-300 
        absolute left-0 bottom-full
        transition-all duration-500 ease-in-out transform
        ${isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}
      >
        <audio 
          ref={audioRef} 
          onTimeUpdate={handleTimeUpdate}
        />

        {/* Hiển thị tên bài hát hiện tại */}
        <div className="text-center mb-2 text-sm font-semibold">
          {DEFAULT_PLAYLIST[selectedTrackIndex].title}
        </div>

        <div className="mb-4">
          <div 
            className="w-full h-1 bg-zinc-400 cursor-pointer hover:bg-gray-600 transition-colors"
            onClick={handleSeek}
          >
            <div 
              className="h-1 bg-yellow-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <label className="cursor-pointer">
            <input 
              type="file" 
              accept="audio/*" 
              onChange={handleFileUpload} 
              className="hidden"
            />
            <div className="bg-cyan-200 p-2 rounded-full hover:bg-cyan-700 transition-colors">
              <Upload size={20} className="text-white" />
            </div>
          </label>

          <button
            onClick={togglePlay}
            className="bg-emerald-200 text-white p-3 rounded-full hover:bg-emerald-800 transition-colors"
            disabled={!audioSrc}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <div className="flex items-center">
            {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={volume}
              onChange={handleVolumeChange}
              className="ml-2 w-8 h-1 bg-blue-50 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Nút mở danh sách phát */}
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="bg-purple-200 p-2 rounded-full hover:bg-purple-700 transition-colors"
          >
            <List size={20} />
          </button>
        </div>

        {/* Danh sách phát */}
        {showPlaylist && (
          <div className="mt-2 max-h-40 overflow-y-auto bg-white rounded-lg shadow-inner">
            {DEFAULT_PLAYLIST.map((track, index) => (
              <div 
                key={index}
                onClick={() => selectTrack(index)}
                className={`p-2 cursor-pointer hover:bg-gray-100 
                  ${selectedTrackIndex === index ? 'bg-blue-100' : ''}`}
              >
                {track.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;