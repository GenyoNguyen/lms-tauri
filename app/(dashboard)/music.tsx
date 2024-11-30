import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Upload, Volume2, VolumeX } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Predefined playlist (you can replace these with actual paths)
  const DEFAULT_PLAYLIST = [
    'audio.mp3'
  ];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();}
        else {
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
      setAudioSrc(DEFAULT_PLAYLIST[0]);
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
    let timer: NodeJS.Timeout;

    const handleMouseMove = () => {
      setIsVisible(true);
      
      // Clear previous timer
      if (timer) {
        clearTimeout(timer);
      }

      // Set new timer to hide player after 3 seconds of inactivity
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 500);
    };

    // Add global mouse move listener
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  return (
    <div 
      className={`fixed bottom-28 left-28 transform -translate-x-1/2 z-50 
        bg-teal-100 rounded-2xl shadow-2xl p-4 w-48 border border-gray-300
        transition-all duration-500 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-20 hover:opacity-100'}`}
    >
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
      />

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
      </div>
    </div>
  );
};

export default MusicPlayer;