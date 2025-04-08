import React, { useState, useEffect } from "react";
import { FaMicrophone, FaStop, FaPause, FaPlay } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { ReactMic } from "react-mic";

export const Record = ({
  isRecording,
  isPaused,
  onRecordingStateChange,
  setRecordingTime,
}) => {
  const [isRecordingState, setIsRecordingState] = useState(isRecording);
  const [isPausedState, setIsPausedState] = useState(isPaused);
  const [timer, setTimer] = useState(0);
  let timerInterval = null;
  const onStop = (blob) => {
    ("blob",blob);
    
    setIsRecordingState(false);
    setIsPausedState(false);
    onRecordingStateChange(false, false); // Stop recording and reset pause
    clearInterval(timerInterval);
  };
   const onData = (recordedBlob) => {
     ("chunk of real-time data is: ", recordedBlob);
   };

  const handleStart = () => {
    setIsRecordingState(true);
    setIsPausedState(false);
    onRecordingStateChange(true, false); // Start recording
    setTimer(0); // Reset timer
    timerInterval = setInterval(() => {
      setTimer((prevTime) => prevTime + 1); // Increment timer every second
    }, 1000);
  };

  const handlePause = () => {
    setIsPausedState(true);
    onRecordingStateChange(isRecordingState, true); // Pause recording
    clearInterval(timerInterval);
  };

  const handleResume = () => {
    setIsPausedState(false);
    onRecordingStateChange(isRecordingState, false); // Resume recording
    timerInterval = setInterval(() => {
      setTimer((prevTime) => prevTime + 1); // Increment timer every second
    }, 1000);
  };

  const handleClear = () => {
    // Clear the recording data and reset states
    setIsRecordingState(false);
    setIsPausedState(false);
    onRecordingStateChange(false, false); // Clear the parent's states
    clearInterval(timerInterval); // Clear the timer
  };

  // Ensure the child state stays in sync with the parent
  useEffect(() => {
    setIsRecordingState(isRecording);
    setIsPausedState(isPaused);
  }, [isRecording, isPaused]);

  // Pass timer state to parent
  useEffect(() => {
    setRecordingTime(timer);
  }, [timer, setRecordingTime]);

  return (
    <div className="flex items-center gap-2">
      {!isRecordingState && (
        <button onClick={handleStart}>
          <span>
            <FaMicrophone className="text-red w-5 h-5" />
          </span>
        </button>
      )}

      {isRecordingState && (
        <ReactMic
          record={isRecordingState}
          onStop={onStop}
          onData={onData}
          className="w-full max-w-xl h-fit sound-wave"
          strokeColor="#000000"
          backgroundColor="white"
          visualSetting="sinewave"
          //   strokeColor="red"
          //   backgroundColor="white"
          //   audioBitsPerSecond={16000}
          //   amplitude={100}
        />
      )}
      {isRecordingState && !isPausedState && (
        <button onClick={handlePause}>
          <FaPause className=" w-5 h-5" />
        </button>
      )}

      {isRecordingState && isPausedState && (
        <button onClick={handleResume}>
          <FaMicrophone className="text-red  w-5 h-5" />
        </button>
      )}

      {isRecordingState && (
        <button onClick={handleClear}>
          <MdDelete className=" w-5 h-5" />
        </button>
      )}
    </div>
  );
};
