import React, { useRef, useState, useEffect } from "react";
import "./style.scss";
import { FaPlay, FaStop } from "react-icons/fa6";

const formatTime = (time) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const CustomAudioPlayer = ({ audioSrc, className, progressClass }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);

    const setAudioDuration = () => {
      (audio.duration);
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    // Add event listeners
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioDuration);
    audio.addEventListener("loadeddata", setAudioDuration);
    return () => {
      // Cleanup event listeners
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
      audio.removeEventListener("loadeddata", setAudioDuration);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

 const handleSeek = (e) => {
   const audio = audioRef.current;
   if (audio.duration && !isNaN(audio.duration)) {
     const seekTime = (audio.duration * e.target.value) / 100;
     audio.currentTime = seekTime;
   }
 };


  return (
    <div className={`custom-audio-player  max-w-md p-2 m-2 ${className}`}>
      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={() => setIsPlaying(false)}
      />

      <button
        className={`play-btn ${isPlaying ? "playing" : ""}`}
        onClick={togglePlay}
      >
        {isPlaying ? <FaStop /> : <FaPlay />}
      </button>

      <div className="progress-bar-container">
        <input
          type="range"
          className={`progress-bar ${progressClass}`}
          value={(currentTime / (duration || 1)) * 100}
          onChange={handleSeek}
        />
        <div className="time-display ">
          <span>{formatTime(currentTime)}</span>{" "}
        </div>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;
